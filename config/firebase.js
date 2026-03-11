// config/firebase.js
const admin = require("firebase-admin");

// Ensure required environment variables are present
const requiredEnv = ["FB_PROJECT_ID", "FB_CLIENT_EMAIL", "FB_PRIVATE_KEY"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing Firebase environment variable: ${key}`);
  }
});

// Fix private key formatting for Render
const privateKey = process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n");

// Firebase service account
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FB_PROJECT_ID,
  private_key: privateKey,
  client_email: process.env.FB_CLIENT_EMAIL,
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Use your database URL directly
  databaseURL: "https://nj777-2756c-default-rtdb.firebaseio.com",
});

// Export the database instance
const db = admin.database();
module.exports = db;