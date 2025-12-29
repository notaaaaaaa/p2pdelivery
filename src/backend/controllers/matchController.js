const matchModel = require('../models/matchModel');
const userModel = require('../models/userModel');

exports.matchRequestsAndDeliveries = async (req, res) => {
  try {
    const { requestId } = req.body;
    const match = await matchModel.findAndCreateMatch(requestId);
    if (match) {
      res.status(201).json(match);
    } else {
      res.status(404).json({ message: "No match found" });
    }
  } catch (err) {
    console.error('Error in matchRequestsAndDeliveries:', err);
    res.status(500).json({ error: 'Failed to create match', details: err.message });
  }
};

exports.getActiveMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const match = await matchModel.getActiveMatch(userId);
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: "No active match found" });
    }
  } catch (err) {
    console.error('Error in getActiveMatch:', err);
    res.status(500).json({ error: 'Failed to get active match', details: err.message });
  }
};

exports.checkForMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Checking for match for user:", userId);
    const newMatch = await matchModel.getNewMatchForUser(userId);
    if (newMatch) {
      res.status(200).json({ match: newMatch, isNewMatch: true });
    } else {
      const existingMatch = await matchModel.getActiveMatch(userId);
      if (existingMatch) {
        res.status(200).json({ match: existingMatch, isNewMatch: false });
      } else {
        res.status(200).json({ match: null });
      }
    }
  } catch (err) {
    console.error('Error in checkForMatch:', err);
    res.status(500).json({ error: 'Failed to check for match', details: err.message });
  }
};

exports.getMatchDetails = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await matchModel.getMatchById(matchId);
    if (match) {
      res.status(200).json(match);
    } else {
      res.status(404).json({ message: "Match not found" });
    }
  } catch (err) {
    console.error('Error in getMatchDetails:', err);
    res.status(500).json({ error: 'Failed to get match details', details: err.message });
  }
};