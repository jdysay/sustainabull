import axios from 'axios';

/**
 * Sends trip completion data to the backend to apply rewards
 * 
 * @param {Object} tripData - Trip data including distance and transport mode
 * @param {Object} rewards - Reward calculations from the trip
 * @returns {Promise} - Response from the backend
 */
export const sendTripRewards = async (tripData, rewards) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No authentication token found");
      return { success: false, error: 'Authentication required' };
    }
    
    const payload = {
      distance: tripData.distance || 0,
      transport_mode: tripData.transportMode || 'Walk',
      xp: rewards.xp || 0,
      coins: rewards.coins || 0,
      food: rewards.food || ''
    };
    
    console.log('Sending trip rewards to backend:', payload);
    
    const response = await axios.post(
      'http://localhost:8000/api/routes/complete-trip/',
      payload,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Trip rewards response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending trip rewards:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to process rewards'
    };
  }
};
