const db = require('../db');

const userModel = {
  async createUser(userData) {
    const { firebase_uid, email, name, phone_number } = userData;
    const query = `
      INSERT INTO users (firebase_uid, email, name, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [firebase_uid, email, name, phone_number];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getUserByFirebaseUid(firebaseUid) {
    const query = 'SELECT * FROM users WHERE firebase_uid = $1';
    try {
      const result = await db.query(query, [firebaseUid]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getUserByFirebaseUid:', error);
      throw error;
    }
  },
};

module.exports = userModel;