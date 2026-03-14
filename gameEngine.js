const { db } = require("../firebase");

async function playGame(uid, betAmount){

  const ref = db.ref("users/" + uid);
  const snapshot = await ref.once("value");

  if(!snapshot.exists()) return {error:"Player not found"};

  let player = snapshot.val();

  if(player.coins < betAmount){
    return {error:"Not enough coins"};
  }

  // Simple random game result
  let win = Math.random() < 0.5;

  if(win){
    player.coins += betAmount;
    player.wins = (player.wins || 0) + 1;
  }else{
    player.coins -= betAmount;
    player.losses = (player.losses || 0) + 1;
  }

  await ref.update({
    coins: player.coins,
    wins: player.wins,
    losses: player.losses
  });

  return {
    win,
    coins: player.coins
  };
}

module.exports = { playGame };