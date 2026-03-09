const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

} else {
  console.log("FIREBASE_KEY not found in environment variables");
}

const db = admin.firestore();

module.exports = db;