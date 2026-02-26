const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Get database reference
const db = admin.database();


// 🎮 Test route
router.get("/", (req, res) => {
  res.json({ message: "Game route working 🎮" });
});


// 🎰 Spin route
router.post("/spin", async (req, res) => {
  try {
    const { playerId, bet } = req.body;

    if (!playerId || !bet) {
      return res.status(400).json({ message: "Missing playerId or bet" });
    }

    const playerRef = db.ref(`players/${playerId}`);
    const snapshot = await playerRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ message: "Player not found" });
    }

    const player = snapshot.val();

    // Check enough coins
    if (player.coins < bet) {
      return res.status(400).json({ message: "Not enough coins" });
    }

    // Deduct bet
    let newCoins = player.coins - bet;

    // 30% win chance
    const win = Math.random() < 0.3;
    let winAmount = 0;

    if (win) {
      winAmount = bet * 2;
      newCoins += winAmount;
    }

    // Update player coins in Firebase
    await playerRef.update({
      coins: newCoins
    });

    res.json({
      win,
      winAmount,
      remainingCoins: newCoins
    });

  } catch (error) {
    console.error("Spin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;