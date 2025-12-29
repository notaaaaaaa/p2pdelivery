const admin = require('../../firebase/firebaseAdmin');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    
    const user = await userModel.getUserByFirebaseUid(firebaseUid);
    if (!user) {
      console.log('User not found for Firebase UID:', firebaseUid);
      return res.status(404).json({ error: 'User not found' });
    }
    
    req.user = { id: user.id, firebaseUid: user.firebase_uid }; // Ensure this is the database user ID
    console.log('User authenticated:', req.user);
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(403).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;