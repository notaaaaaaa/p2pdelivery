const { client, query } = require('../db');

const deliveryModel = {
  async createDelivery(userId, restaurantId) {
    try {
      await query('BEGIN');

      // Insert the new delivery
      const insertQuery = `
        INSERT INTO deliveries (user_id, restaurant_id, status, created_at)
        VALUES ($1, $2, 'available', NOW())
        RETURNING *;
      `;
      console.log("Inserting delivery with userId:", userId, "restaurantId:", restaurantId, "Type:", typeof restaurantId);
      const deliveryResult = await query(insertQuery, [userId, String(restaurantId)]);
      const newDelivery = deliveryResult.rows[0];

      // Check for a matching request
      const matchQuery = `
        SELECT r.id AS request_id, r.user_id AS requester_id
        FROM requests r
        WHERE r.restaurant_id = $1 AND r.status = 'pending' AND r.user_id != $2
        ORDER BY r.created_at ASC
        LIMIT 1;
      `;
      const matchResult = await query(matchQuery, [restaurantId, userId]);
      
      let match = null;
      if (matchResult.rows.length > 0) {
        const request = matchResult.rows[0];
        
        // Create a match
        const createMatchQuery = `
          INSERT INTO matches (request_id, delivery_id, status, created_at)
          VALUES ($1, $2, 'active', NOW())
          RETURNING *;
        `;
        const matchInsertResult = await query(createMatchQuery, [request.request_id, newDelivery.id]);
        match = matchInsertResult.rows[0];

        // Update request and delivery status
        await query('UPDATE requests SET status = $1 WHERE id = $2', ['active', request.request_id]);
        await query('UPDATE deliveries SET status = $1 WHERE id = $2', ['active', newDelivery.id]);
      }

      await query('COMMIT');
      return { delivery: newDelivery, match };
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  async getAvailableDeliveries(restaurantId) {
    const queryText = `
      SELECT d.*, u.name, u.phone_number, u.hostel_number, u.room_number
      FROM deliveries d
      JOIN users u ON d.user_id = u.id
      WHERE d.restaurant_id = $1 AND d.status = 'available'
      ORDER BY d.created_at ASC;
    `;
    const result = await query(queryText, [restaurantId]);
    return result.rows;
  },
};

module.exports = deliveryModel;