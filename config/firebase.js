// config/firebase.js
const admin = require("firebase-admin");


const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
module.exports = db;


if (!admin.apps.length) {
  if (!process.env.FB_DATABASE_URL) {
    console.error("❌ FB_DATABASE_URL is missing!");
    process.exit(1); // stop server if missing
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      clientEmail: process.env.FB_CLIENT_EMAIL,
      privateKey: process.env.FB_PRIVATE_KEY
        ? process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n")
        : undefined,
    }),
    databaseURL: process.env.FB_DATABASE_URL,
  });
}


console.log("✅ Firebase initialized successfully with DB:", process.env.FB_DATABASE_URL);

