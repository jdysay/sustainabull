// Shop.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Shop = () => {
  const { user, loading, updateGold } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('display');
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  console.log("Shop component rendering");
  console.log("Auth state:", { user, loading });
  console.log("localStorage token:", localStorage.getItem('token'));

  // Redirect if not logged in
  useEffect(() => {
    console.log("Shop auth check triggered");
    console.log("Loading:", loading, "User:", user);
    
    // Only redirect if we're done loading and there's no user and no token
    if (!loading && !user && !localStorage.getItem('token')) {
      console.log("No auth detected, redirecting to login");
      navigate('/login');
    } else {
      console.log("Auth check passed or still loading");
    }
  }, [user, navigate, loading]);

  const items = [
    { id: 1, name: 'GRASS', price: 10, description: 'Increase your hunger by 10%', image: 'src/assets/images/grass.png' },
    { id: 2, name: 'HAY', price: 15, description: 'Increase your hunger by 15%', image: 'src/assets/images/hay.png' },
    { id: 3, name: 'CARROT', price: 25, description: 'Increase your hunger by 25%', image: 'src/assets/images/carrot.png' },
    { id: 4, name: 'CORN CHUNKS', price: 20, description: 'Increase your hunger by 20%', image: 'src/assets/images/corn.png' },
    { id: 5, name: 'APPLE', price: 5, description: 'Increase your hunger by 5%', image: 'src/assets/images/apple.png' },
    { id: 6, name: 'CAKE', price: 30, description: 'Increase your hunger by 30%', image: 'src/assets/images/cake.png' },
  ];

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const resetShop = () => {
    setActiveTab('display');
    setPurchaseComplete(false);
    setCart([]);
  };

  const addToInventory = async (purchasedItems) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No authentication token found");
        return false;
      }
      
      console.log("Adding items to inventory:", purchasedItems);
      
      // First, let's test if authentication is working
      try {
        const testResponse = await axios.get(
          'http://localhost:8000/api/shop/test-auth/',
          { 
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log("Auth test successful:", testResponse.data);
      } catch (testError) {
        console.error("Auth test failed:", testError);
        return false;
      }
      
      // Format the data correctly
      const formattedItems = purchasedItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
      
      console.log("Sending to API:", { items: formattedItems });
      
      const response = await axios.post(
        'http://localhost:8000/api/shop/add-to-inventory/',
        { items: formattedItems },
        { 
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Items added to inventory response:", response.data);
      return true;
    } catch (error) {
      console.error("Error adding items to inventory:", error);
      
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      
      return false;
    }
  };

  const handlePurchase = async () => {
    // Reset error
    setError('');
    
    if (!user) {
      setError('You must be logged in to make a purchase');
      return;
    }

    const totalCost = calculateTotal();
    
    // Convert to numbers to ensure proper comparison
    const userGold = Number(user.gold);
    const cost = Number(totalCost);
    
    if (userGold < cost) {
      setError(`Not enough gold! You need ${(cost - userGold).toFixed(2)} more gold.`);
      return;
    }

    try {
      // First update gold
      const newGoldAmount = userGold - cost;
      const goldSuccess = await updateGold(newGoldAmount);
      
      if (goldSuccess) {
        // Then add items to inventory
        const inventorySuccess = await addToInventory(cart);
        
        if (inventorySuccess) {
          console.log("Purchase complete and items added to inventory");
          setPurchaseComplete(true);
          setCart([]);
        } else {
          console.warn("Gold updated but failed to add items to inventory");
          setError('Your gold was deducted but there was an issue adding items to your inventory. Please contact support.');
        }
      } else {
        setError('Failed to update your gold balance. Please try again.');
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setError('An error occurred while processing your purchase.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 font-mono">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl font-bold">Loading...</div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-center mb-8">SHOP</h1>
            <div className="flex items-center gap-3">
              <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
                {user ? user.gold : 0} Gold
              </span>
              <Link to="/home" className="text-blue-500 hover:text-blue-700">
                Home
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab('display')}
              className={`px-4 py-2 rounded ${activeTab === 'display' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Display
            </button>
            <button
              onClick={() => cart.length > 0 ? setActiveTab('purchase') : alert('Your cart is empty!')}
              className={`px-4 py-2 rounded ${activeTab === 'purchase' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              disabled={cart.length === 0}
            >
              Purchase Screen ({cart.reduce((total, item) => total + item.quantity, 0)})
            </button>
          </div>

          {activeTab === 'display' && (
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Available Items</h2>
                <div className="text-lg">
                  Items in cart: <span className="font-bold">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col bg-white">
                    <div className="mb-3 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-32 w-32 object-contain"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-black">{item.name}</h3>
                    <p className="text-gray-600 mb-2 flex-grow">{item.description}</p>
                    <p className="font-bold mb-3 text-black">Price: ${item.price}</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                      >
                        Add to Cart
                      </button>
                      <span className="text-sm text-gray-500">
                        {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0} in cart
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchase' && !purchaseComplete && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Your Order</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg mb-4">Your cart is empty!</p>
                  <button
                    onClick={() => setActiveTab('display')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
                  >
                    Back to Shop
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 object-contain"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.png';
                              e.target.onerror = null;
                            }}
                          />
                          <div>
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            <p className="text-gray-600">${item.price} each</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-l"
                            >
                              -
                            </button>
                            <span className="border-t border-b border-gray-300 w-10 h-8 flex items-center justify-center text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-r"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold w-16 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-md mt-2">
                      <span>Your Gold:</span>
                      <span>${user ? user.gold : 0}</span>
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-3">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setActiveTab('display')}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded"
                    >
                      Back to Shop
                    </button>
                    <button
                      onClick={handlePurchase}
                      className={`bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded ${
                        user && user.gold >= calculateTotal() ? '' : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!user || user.gold < calculateTotal()}
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'purchase' && purchaseComplete && (
            <div className="text-center py-8">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <h2 className="text-2xl font-semibold mb-2">Purchase Complete!</h2>
                <p className="mb-2">Thank you for your purchase.</p>
                <p className="font-bold">Total: ${calculateTotal().toFixed(2)}</p>
              </div>

              <div className="mb-6 text-left max-w-md mx-auto">
                <h3 className="text-lg font-medium mb-2">Items Purchased:</h3>
                <ul className="space-y-2">
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={resetShop}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
              >
                Back to Shop
              </button>
            </div>
          )}

          <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
            <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
              Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;