// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

// Get all players
router.get("/players", async (req, res) => {
  try {
    const snapshot = await db.ref("players").once("value");
    const players = snapshot.val() || {};
    res.json(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});



// Add coins to player
router.post("/add-coins", async (req, res) => {
  const { playerId, coins } = req.body;

  try {
    const playerRef = db.ref("players/" + playerId);

    const snapshot = await playerRef.once("value");
    const player = snapshot.val();

    const newCoins = (player.coins || 0) + Number(coins);

    await playerRef.update({
      coins: newCoins
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Failed to update coins" });
  }
});

const express = require("express");
const router = express.Router();
const db = require("../config/firebase"); // path must be correct

// Get all players
router.get("/players", async (req, res) => {
  try {
    const snapshot = await db.ref("players").once("value");
    const players = snapshot.val() || {};
    res.json(players);
  } catch (err) {
    console.error("Failed to fetch players:", err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// Add coins
router.post("/add-coins", async (req, res) => {
  const { playerId, coins } = req.body;
  try {
    const playerRef = db.ref("players/" + playerId);
    const snapshot = await playerRef.once("value");
    const player = snapshot.val();
    const newCoins = (player.coins || 0) + Number(coins);
    await playerRef.update({ coins: newCoins });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to add coins:", err);
    res.status(500).json({ error: "Failed to update coins" });
  }
});

module.exports = router;