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

  // Fetch user's inventory when component mounts
  useEffect(() => {
    fetchInventory();
  }, [user]);

  const fetchInventory = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication error. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        'http://localhost:8000/api/shop/inventory/',
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Inventory API response:", response.data);

      // Filter out items with quantity 0
      const userItems = response.data.filter(item => item.quantity > 0);
      console.log("Filtered user inventory:", userItems);
      setInventory(userItems);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError('Failed to load your inventory. Please try again later.');
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
      fetchInventory();
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
            <Link
              to="/shop"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
            >
              Go to Shop
            </Link>
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
                    <span className="bg-gray-100 px-3 py-1 rounded-full">{item.quantity}</span>
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