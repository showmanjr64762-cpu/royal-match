const db = require("./config/firebase");

async function test() {
  try {
    const snapshot = await db.ref("players").once("value");
    console.log("Players:", snapshot.val());
  } catch(err) {
    console.error("Firebase connection failed:", err);
  }
}

test();