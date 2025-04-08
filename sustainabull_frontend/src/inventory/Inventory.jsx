// Inventory.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedResult, setFeedResult] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [allItems, setAllItems] = useState([]); // Store all item data

  // Fetch user's inventory and all items when component mounts
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication error. Please log in again.');
        setIsLoading(false);
        return;
      }

      // First get all items for reference
      const itemsResponse = await axios.get(
        'http://localhost:8000/api/shop/items/',
        { headers: { 'Authorization': `Token ${token}` } }
      );
      setAllItems(itemsResponse.data);
      console.log("All available items:", itemsResponse.data);

      // Then get user's inventory
      const inventoryResponse = await axios.get(
        'http://localhost:8000/api/shop/inventory/',
        { headers: { 'Authorization': `Token ${token}` } }
      );

      console.log("Raw inventory response:", inventoryResponse.data);

      // Enhance inventory items with full item details
      const enhancedInventory = inventoryResponse.data.map(invItem => {
        const itemDetails = itemsResponse.data.find(item => item.id === invItem.item);
        return {
          ...invItem,
          item_details: itemDetails || {
            name: `Item #${invItem.item}`,
            description: "Item details not available",
            image: null
          }
        };
      });

      console.log("Enhanced inventory:", enhancedInventory);
      
      // Filter out items with quantity 0
      const userItems = enhancedInventory.filter(item => item.quantity > 0);
      setInventory(userItems);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 404) {
        setError('Inventory service is not available. Please try again later.');
      } else {
        setError('Failed to load your inventory. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const feedCow = async (itemId, quantity = 1) => {
    try {
      setFeedbackMessage('');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication error. Please log in again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/shop/feed-cow/',
        {
          item_id: itemId,
          quantity: quantity
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Feed cow response:", response.data);
      setFeedResult(response.data);
      setFeedbackMessage(`Successfully fed your cow with the item! Hunger increased by ${response.data.feed_result.increase}%`);

      // Update inventory
      fetchData();
    } catch (error) {
      console.error("Error feeding cow:", error);
      setFeedbackMessage(error.response?.data?.error || 'Failed to feed your cow. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  // For debugging - add inventory to item directly
  const debugAddItem = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.post(
        'http://localhost:8000/api/shop/add-to-inventory/',
        { 
          item_id: itemId,
          quantity: quantity 
        },
        { 
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`Added ${quantity} of item #${itemId} to inventory:`, response.data);
      fetchData(); // Refresh inventory
      setFeedbackMessage(`Added ${quantity} of item #${itemId} to your inventory!`);
    } catch (error) {
      console.error(`Error adding item to inventory:`, error);
      setError('Failed to add item to inventory');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 font-mono">
      <div className="max-w-4xl mx-auto p-6 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">MY INVENTORY</h1>
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
              {user ? user.gold : 0} Gold
            </span>
            <Link to="/home" className="text-blue-500 hover:text-blue-700">
              Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {feedbackMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {feedbackMessage}
          </div>
        )}

        {inventory.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your inventory is empty</h2>
            <p className="mb-6">Visit the shop to purchase items!</p>
            <div className="space-y-4">
              <Link
                to="/shop"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded block max-w-xs mx-auto"
              >
                Go to Shop
              </Link>
              
              {/* Debug button to add corn chunks directly */}
              <button
                onClick={() => debugAddItem(4, 5)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded block max-w-xs mx-auto"
              >
                Debug: Add 5 Corn Chunks
              </button>
              
              {allItems.length > 0 && (
                <div className="mt-8 p-4">
                  <h3 className="font-bold mb-2">Debug: Add Available Items</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {allItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => debugAddItem(item.id, 1)}
                        className="bg-gray-200 hover:bg-gray-300 py-1 px-3 rounded text-sm"
                      >
                        Add {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col bg-white shadow-md">
                <div className="mb-3 flex justify-center">
                  <img
                    src={item.item_details?.image || '/images/placeholder.png'}
                    alt={item.item_details?.name}
                    className="h-32 w-32 object-contain"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <h3 className="text-xl font-medium mb-2 text-black">{item.item_details?.name}</h3>
                <p className="text-gray-600 mb-2 flex-grow">{item.item_details?.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">Quantity:</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-black">{item.quantity}</span>
                  </div>
                  <button
                    onClick={() => feedCow(item.item, 1)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
                    disabled={item.quantity <= 0}
                  >
                    Feed to Cow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
          <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
          </Link>
          <Link to="/farm" className="mt-6 w-50 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition block text-center">
            View Cow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Inventory;