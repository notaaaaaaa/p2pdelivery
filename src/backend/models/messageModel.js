const db = require('../db');

const messageModel = {
  async createMessage(matchId, senderId, content) {
    console.log("Creating message with senderId:", senderId);
    const query = `
      INSERT INTO messages (match_id, sender_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, match_id, sender_id, content, created_at;
    `;
    try{
      const result = await db.query(query, [matchId, senderId, content]);
      console.log("Created message:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  },

  async getMessagesByMatchId(matchId) {
    const query = `
      SELECT m.*, u.name as sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.match_id = $1
      ORDER BY m.created_at ASC;
    `;
    const result = await db.query(query, [matchId]);
    return result.rows;
  },

  // You can add more methods as needed, such as:
  // - updateMessage
  // - deleteMessage
  // - getLatestMessage
};

module.exports = messageModel;

