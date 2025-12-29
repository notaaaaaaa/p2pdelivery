const messageModel = require('../models/messageModel');

exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const messages = await messageModel.getMessagesByMatchId(matchId);
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    console.log("Fetching messages for match:", matchId);
    const messages = await messageModel.getMessagesByMatchId(matchId);
    console.log("Fetched messages:", messages);
    const messagesArray = Array.isArray(messages) ? messages : [];
    res.status(200).json({ messages: messagesArray });
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};
