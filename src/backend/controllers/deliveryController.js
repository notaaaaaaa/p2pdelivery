
const deliveryModel = require('../models/deliveryModel');

exports.createDelivery = async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const userId = req.user.id; // This should now be the correct database user_id
    console.log('Creating delivery for user:', userId, 'restaurant:', restaurantId);

    const result = await deliveryModel.createDelivery(userId, restaurantId);
    
    if (result.match) {
      res.status(201).json({ 
        message: 'Delivery offer created and matched', 
        delivery: result.delivery, 
        match: result.match 
      });
    } else {
      res.status(201).json({ 
        message: 'Delivery offer created', 
        delivery: result.delivery 
      });
    }
  } catch (err) {
    console.error('Error in createDelivery:', err);
    res.status(500).json({ error: 'Failed to create delivery offer', details: err.message });
  }
};

exports.getAvailableDeliveries = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const availableDeliveries = await deliveryModel.getAvailableDeliveries(restaurantId);
    res.status(200).json(availableDeliveries);
  } catch (err) {
    console.error('Error in getAvailableDeliveries:', err);
    res.status(500).json({ error: 'Failed to get available deliveries', details: err.message });
  }
};