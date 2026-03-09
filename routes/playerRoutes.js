const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.post("/update", async (req, res) => {

  const { playerId, score, coins } = req.body;

  await db.collection("players").doc(playerId).set({
    score,
    coins
  }, { merge: true });

  res.send("Player updated");

});

router.get("/players", async (req, res) => {

  const snapshot = await db.collection("players").get();

  const players = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.json(players);

});

module.exports = router;