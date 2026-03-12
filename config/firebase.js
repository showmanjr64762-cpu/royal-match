const admin = require("firebase-admin");

const serviceAccount = require("../firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nj777-2756c-default-rtdb.firebaseio.com"
});

module.exports = admin;