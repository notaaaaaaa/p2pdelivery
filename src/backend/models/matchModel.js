const db = require('../db');

const matchModel = {
  async findAndCreateMatch() {
    const query = `
      WITH potential_match AS (
        SELECT r.id AS request_id, d.id AS delivery_id,
               r.user_id AS requester_id, d.user_id AS deliverer_id,
               r.restaurant_id, r.created_at AS request_time, d.created_at AS delivery_time
        FROM requests r
        JOIN deliveries d ON r.restaurant_id = d.restaurant_id
        WHERE r.status = 'pending' AND d.status = 'available' AND r.user_id != d.user_id
        ORDER BY GREATEST(r.created_at, d.created_at) ASC
        LIMIT 1
      ),
      update_request AS (
        UPDATE requests
        SET status = 'active'
        FROM potential_match
        WHERE requests.id = potential_match.request_id
        RETURNING requests.id
      ),
      update_delivery AS (
        UPDATE deliveries
        SET status = 'active'
        FROM potential_match
        WHERE deliveries.id = potential_match.delivery_id
        RETURNING deliveries.id
      )
      INSERT INTO matches (request_id, delivery_id, status, created_at)
      SELECT request_id, delivery_id, 'active', NOW()
      FROM potential_match
      WHERE EXISTS (SELECT 1 FROM update_request) AND EXISTS (SELECT 1 FROM update_delivery)
      RETURNING *;
    `;
    const result = await db.query(query);
    return result.rows[0];
  },

  // ... (keep other existing methods)

  async checkAndCreateMatch() {
    const match = await this.findAndCreateMatch();
    if (match) {
      return match;
    }
    return null;
  },
  async getActiveMatch(userId) {
    const query = `
      SELECT m.*, r.user_id as requester_id, d.user_id as deliverer_id
      FROM matches m
      JOIN requests r ON m.request_id = r.id
      JOIN deliveries d ON m.delivery_id = d.id
      WHERE (r.user_id = $1 OR d.user_id = $1) AND m.status = 'active'
      ORDER BY m.created_at DESC
      LIMIT 1;
    `;
    console.log('Checking for active match for user:', userId);
    const result = await db.query(query, [userId]);
    console.log('Match query result:', result.rows);
    return result.rows[0] || null;
  },
  

  async findMatch(userId, userType) {
    let query;
    if (userType === 'request') {
      query = `
        SELECT m.*, r.user_id as requester_id, d.user_id as deliverer_id
        FROM requests r
        JOIN deliveries d ON r.restaurant_id = d.restaurant_id
        LEFT JOIN matches m ON r.id = m.request_id OR d.id = m.delivery_id
        WHERE r.user_id = $1 AND r.status = 'pending' AND d.status = 'available' AND m.id IS NULL
        LIMIT 1;
      `;
    } else {
      query = `
        SELECT m.*, r.user_id as requester_id, d.user_id as deliverer_id
        FROM deliveries d
        JOIN requests r ON d.restaurant_id = r.restaurant_id
        LEFT JOIN matches m ON r.id = m.request_id OR d.id = m.delivery_id
        WHERE d.user_id = $1 AND d.status = 'available' AND r.status = 'pending' AND m.id IS NULL
        LIMIT 1;
      `;
    }
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
  ,
  async getMatchById(matchId) {
    const query = `
      SELECT m.*, 
             r.user_id AS requester_id, r.restaurant_id,
             d.user_id AS deliverer_id,
             ur.name AS requester_name, ud.name AS deliverer_name
      FROM matches m
      JOIN requests r ON m.request_id = r.id
      JOIN deliveries d ON m.delivery_id = d.id
      JOIN users ur ON r.user_id = ur.id
      JOIN users ud ON d.user_id = ud.id
      WHERE m.id = $1
    `;
    const result = await db.query(query, [matchId]);
    return result.rows[0];
  },
  async getNewMatchForUser(userId) {
    const query = `
      SELECT m.*, r.user_id as requester_id, d.user_id as deliverer_id
      FROM matches m
      JOIN requests r ON m.request_id = r.id
      JOIN deliveries d ON m.delivery_id = d.id
      WHERE (r.user_id = $1 OR d.user_id = $1) AND m.status = 'active'
      AND m.created_at > (NOW() - INTERVAL '10 seconds')
      ORDER BY m.created_at DESC
      LIMIT 1;
    `;
    console.log('Checking for new match for user:', userId);
    const result = await db.query(query, [userId]);
    console.log('New match query result:', result.rows);
    return result.rows[0] || null;
  },
};

module.exports = matchModel;