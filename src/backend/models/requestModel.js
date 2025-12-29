const { client, query } = require('../db');

const requestModel = {
  async createRequest(userId, restaurantId) {
    try {
      await query('BEGIN');

      // Insert the new request
      const insertQuery = `
        INSERT INTO requests (user_id, restaurant_id, status, created_at)
        VALUES ($1, $2, 'pending', NOW())
        RETURNING *;
      `;
      const requestResult = await query(insertQuery, [userId, restaurantId]);
      const newRequest = requestResult.rows[0];

      // Check for a matching delivery
      const matchQuery = `
        SELECT d.id AS delivery_id, d.user_id AS deliverer_id
        FROM deliveries d
        WHERE d.restaurant_id = $1 AND d.status = 'available' AND d.user_id != $2
        ORDER BY d.created_at ASC
        LIMIT 1;
      `;
      const matchResult = await query(matchQuery, [restaurantId, userId]);
      
      let match = null;
      if (matchResult.rows.length > 0) {
        const delivery = matchResult.rows[0];
        
        // Create a match
        const createMatchQuery = `
          INSERT INTO matches (request_id, delivery_id, status, created_at)
          VALUES ($1, $2, 'active', NOW())
          RETURNING *;
        `;
        const matchInsertResult = await query(createMatchQuery, [newRequest.id, delivery.delivery_id]);
        match = matchInsertResult.rows[0];

        // Update request and delivery status
        await query('UPDATE requests SET status = $1 WHERE id = $2', ['active', newRequest.id]);
        await query('UPDATE deliveries SET status = $1 WHERE id = $2', ['active', delivery.delivery_id]);
      }

      await query('COMMIT');
      return { request: newRequest, match };
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async getPendingRequests(restaurantId) {
    const queryText = `
      SELECT r.*, u.name, u.phone_number, u.hostel_number, u.room_number
      FROM requests r
      JOIN users u ON r.user_id = u.id
      WHERE r.restaurant_id = $1 AND r.status = 'pending'
      ORDER BY r.created_at ASC;
    `;
    const result = await query(queryText, [restaurantId]);
    return result.rows;
  },
};

module.exports = requestModel;