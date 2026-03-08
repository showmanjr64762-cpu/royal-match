const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// get all players
router.get("/players", async (req, res) => {
  try {
    const snapshot = await db.ref("players").once("value");
    const players = snapshot.val() || {};
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// add coins
router.post("/addCoins", async (req, res) => {
  const { playerId, amount } = req.body;

  try {
    const ref = db.ref(`players/${playerId}`);
    const snapshot = await ref.once("value");
    const player = snapshot.val();

    player.coins += amount;

    await ref.set(player);

    res.json({ success: true, coins: player.coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// remove coins
router.post("/removeCoins", async (req, res) => {
  const { playerId, amount } = req.body;

  try {
    const ref = db.ref(`players/${playerId}`);
    const snapshot = await ref.once("value");
    const player = snapshot.val();

    player.coins -= amount;

    await ref.set(player);

    res.json({ success: true, coins: player.coins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;