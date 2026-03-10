// server.js
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

// ======================
// Firebase Admin
// ======================
const db = require("./config/firebase"); // use the fixed firebase.js

// ======================
// Express App & Server
// ======================
const app = express();
const server = http.createServer(app);

// ======================
// Middlewares
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Routes
// ======================
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");

app.use("/admin-api", adminRoutes);
app.use("/game", gameRoutes);

// Home & Admin Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

app.get("/admin-DasHBoaRd", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-DasHBoaRd.html"));
});

// ======================
// Helper Functions
// ======================
async function addPlayer(player) {
  const ref = db.ref("players");
  const newRef = ref.push();
  await newRef.set(player);
  return newRef.key;
}

async function getPlayers() {
  const snapshot = await db.ref("players").once("value");
  return snapshot.val() || {};
}

// Test player endpoint
app.get("/add-test-player", async (req, res) => {
  try {
    const player = { name: "Test Player", coins: 1000 };
    await addPlayer(player);
    res.send("Test player added");
  } catch (error) {
    res.status(500).send("Error adding test player");
  }
});

// ======================
// Socket.IO
// ======================
const io = new Server(server, { cors: { origin: "*" } });

// Use the modular gameSocket handler
const gameSocket = require("./sockets/gameSocket");
gameSocket(io);

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});