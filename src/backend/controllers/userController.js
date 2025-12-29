const client = require("../db");
const userModel = require('../models/userModel');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, hostelNumber, roomNumber, firebaseUid } = req.body;

    // Check if user already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const query = `
      INSERT INTO users (firebase_uid, email, name, phone_number, hostel_number, room_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, firebase_uid, email, name, phone_number, hostel_number, room_number, created_at
    `;
    const values = [firebaseUid, email, name, phoneNumber, hostelNumber, roomNumber];

    const result = await client.query(query, values);
    const newUser = result.rows[0];

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getUserByFirebaseUid = async (req, res) => {
  try {
    const { uid } = req.params;
    console.log("Fetching user with Firebase UID:", uid);
    const user = await userModel.getUserByFirebaseUid(uid);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserByFirebaseUid:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  getUserByFirebaseUid
};