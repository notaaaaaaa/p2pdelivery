const admin = require("firebase-admin"); 
const path = require("path");
const fs = require("fs"); 
const serviceAccount=require("./app1-24456-firebase-adminsdk-58p5t-47d465f79c.json")
// Read the service account JSON manually to avoid circular references
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("Firebase Admin initialized successfully");
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  throw error;
}


module.exports = admin;
