require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const admin = require("firebase-admin");

// 🔥 Firebase Admin Setup
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

// -------------------- APP SETUP --------------------
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// -------------------- FIREBASE HELPERS --------------------

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

// -------------------- ROUTES --------------------

const gameRoutes = require("./routes/gameRoutes");
app.use("/game", gameRoutes);

// Main Game
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin Dashboard
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Get All Players (Admin API)
app.get("/admin/players", async (req, res) => {
  try {
    const players = await getPlayers();
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

// Add Test Player
app.get("/add-test-player", async (req, res) => {
  try {
    const id = await addPlayer({
      name: "Test Player",
      coins: 1000,
      banned: false
    });

    res.send(`Test player added with ID: ${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding test player");
  }
});

// -------------------- SOCKET.IO --------------------

// Ban or Unban Player
app.post("/admin/ban/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    const { banned } = req.body;

    await db.ref(`players/${playerId}`).update({
      banned: banned
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update player" });
  }
});

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("🟢 Player connected:", socket.id);

  socket.on("joinGame", (data) => {
    io.emit("adminUpdate", {
      action: "join",
      player: data.name
    });
  });

  socket.on("spin", (data) => {
    io.emit("adminUpdate", {
      action: "spin",
      player: data.name,
      result: data.result
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Player disconnected:", socket.id);
    io.emit("adminUpdate", {
      action: "leave",
      playerId: socket.id
    });
  });
});

// -------------------- START SERVER --------------------

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});