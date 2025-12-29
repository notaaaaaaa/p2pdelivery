const requestModel = require('../models/requestModel');
const matchModel = require('../models/matchModel');
const userModel = require('../models/userModel'); // Import userModel to fetch firebase_uid

exports.createRequest = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const userId = req.user.id; // This should now be the correct database user_id
    console.log('Creating request for user:', userId, 'restaurant:', restaurantId);

    const result = await requestModel.createRequest(userId, restaurantId);
    
    res.status(201).json({ message: 'Request created', request: result.request });
  } catch (err) {
    console.error('Error in createRequest:', err);
    res.status(500).json({ error: 'Failed to create request', details: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const pendingRequests = await requestModel.getPendingRequests(restaurantId);
    res.status(200).json(pendingRequests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get pending requests' });
  }
};