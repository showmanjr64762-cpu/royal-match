const symbols = ["blue", "red", "green", "purple", "diamond"];

function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function generateReels() {
  const reels = [];

  for (let row = 0; row < 3; row++) {
    const line = [];
    for (let col = 0; col < 3; col++) {
      line.push(getRandomSymbol());
    }
    reels.push(line);
  }

  return reels;
}

function calculateWin(reels, bet) {
  let totalWin = 0;

  // Example: middle row win
  if (
    reels[1][0] === reels[1][1] &&
    reels[1][1] === reels[1][2]
  ) {
    totalWin += bet * 5;
  }

  return totalWin;
}

function spinSlot(bet) {
  const reels = generateReels();
  const totalWin = calculateWin(reels, bet);

  return { reels, totalWin };
}

module.exports = { spinSlot };