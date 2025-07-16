const gameBoard = document.getElementById('gameBoard');
const movesText = document.getElementById('moves');
const timerText = document.getElementById('timer');
const winMessage = document.getElementById('winMessage');
const loseMessage = document.getElementById('loseMessage');
const restartBtn = document.getElementById('restartBtn');

const emojiSet = ['🍎','🍌','🍒','🍇','🍉','🍍','🥝','🍑','🍓','🍋'];
let cards = [...emojiSet, ...emojiSet]; // 20 cards

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let countdown;
let timeLeft = 60;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function updateMoves() {
  movesText.textContent = `Moves: ${moves}`;
}

function startTimer() {
  clearInterval(countdown);
  timeLeft = 60;
  timerText.textContent = `Time: ${timeLeft}s`;

  countdown = setInterval(() => {
    timeLeft--;
    timerText.textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      loseMessage.classList.remove('hidden');
      disableBoard();
    }
  }, 1000);
}

function createBoard() {
  gameBoard.innerHTML = '';
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  updateMoves();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  cards = shuffle(cards);

  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = i;
    card.dataset.value = emoji;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });

  startTimer();
}

function flipCard(e) {
  const card = e.target;
  const index = card.dataset.index;

  if (flippedCards.length === 2 || card.classList.contains('flipped') || matchedCards.includes(index)) return;

  card.textContent = card.dataset.value;
  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    updateMoves();
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const val1 = card1.dataset.value;
  const val2 = card2.dataset.value;

  if (val1 === val2) {
    matchedCards.push(card1.dataset.index, card2.dataset.index);
    flippedCards = [];

    if (matchedCards.length === cards.length) {
      clearInterval(countdown);
      winMessage.classList.remove('hidden');
    }
  } else {
    setTimeout(() => {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 600); // Faster reset
  }
}

function disableBoard() {
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.removeEventListener('click', flipCard));
}

restartBtn.addEventListener('click', createBoard);
createBoard();



