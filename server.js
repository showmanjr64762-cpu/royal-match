// server.js
const express = require('express');
const admin = require('firebase-admin');

const app = express(); // ← app must be initialized first

// Parse Firebase key from environment variable
if (!process.env.FIREBASE_KEY) {
  console.error('❌ FIREBASE_KEY environment variable is missing!');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
} catch (err) {
  console.error('❌ Invalid FIREBASE_KEY JSON:', err.message);
  process.exit(1);
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Basic route to check server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Test Firebase connection
app.get('/test-firebase', async (req, res) => {
  try {
    const doc = await db.collection('test').doc('ping').get();
    if (doc.exists) {
      res.send('✅ Firebase is working! Data found.');
    } else {
      res.send('⚠️ Firebase connected, but no data found.');
    }
  } catch (err) {
    res.status(500).send('❌ Firebase error: ' + err.message);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));