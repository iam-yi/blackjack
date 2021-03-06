/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSGList = {
  null: "",
  'T': 'Not Bad ...Tie in this round',
  'D': 'Dealer win in this round',
  'P': 'You win in this round!!!',
  'PBJ': 'You hit the black Jack!!!',
  'DBJ': 'Dealer hit the black Jack',
  'NM': 'Sorry, you have lost all your money'
};

const masterDeck = buildMasterDeck();

/*----- app's state (variables) -----*/
let shuffledDeck;
let dealerHand;
let playerHand;
let winner;
let bankroll;
let betAtm;
let playerTotal, dealerTotal;

/*----- cached element references -----*/
const playerCardContainer = document.getElementById('playerCard');
const dealerCardContainer = document.getElementById('dealerCard');
const betEl = document.getElementById('currentBet');
const chipsEl = document.getElementById('chips');
const bankrollEl = document.getElementById('bankroll');
//Top of Game Button
const dealBTN = document.getElementById('deal-btn');
const hitBTN = document.getElementById('hit-btn');
const standBTN = document.getElementById('stand-btn');
const playagainBTN = document.getElementById('playagain-btn');

/*----- event listeners -----*/
dealBTN.addEventListener('click', dealCard);
hitBTN.addEventListener('click', addCard);
standBTN.addEventListener('click', HandleStand);
playagainBTN.addEventListener('click', handleNewHand);
//Score Display
const playerScoreTxt = document.getElementById('player-score');
const dealerScoreTxt = document.getElementById('dealer-score');
const resultStatusTxt = document.getElementById('result-status');

//money button
const fiveBTN = document.getElementById('chip5');
const tenBTN = document.getElementById('chip10');
const hundredBTN = document.getElementById('chip100');
const txt = document.getElementById('currentBet');

fiveBTN.addEventListener('click', selected5);
tenBTN.addEventListener('click', selected10);
hundredBTN.addEventListener('click', selected100);

//button button
const resetBTN = document.getElementById('reset-btn');

resetBTN.addEventListener('click', init);
/*----- functions -----*/
init();

function init() {
  winner = null;
  playerHand = [];
  dealerHand = [];
  bankroll = 1000;
  playerTotal = dealerTotal = 0;
  betAtm = 0;
  render();
}

function render() {
  renderHand();
  renderControls();
  renderScore();
  bankrollEl.innerHTML = bankroll;
  betEl.innerHTML = betAtm;
  resultStatusTxt.innerHTML = MSGList[winner];
}

function handleNewHand() {
  winner = null;
  playerHand = [];
  dealerHand = [];
  playerTotal = dealerTotal = 0;
  betAtm = 0;
  render();
}

function getNewShuffledDeck() {
  // Create a copy of the masterDeck (leave masterDeck untouched!)
  const tempDeck = [...masterDeck];
  shuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return shuffledDeck;
}

function buildMasterDeck() {
  // Build a 'master' deck of 'card' objects used to create shuffled decks
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

function handInProgress() {
  // game first loading
  return !winner && playerHand.length;
}

function renderControls() {
  dealBTN.style.visibility = !handInProgress() && betAtm && !winner ? 'visible' : 'hidden';
  standBTN.style.visibility = handInProgress() ? 'visible' : 'hidden';
  hitBTN.style.visibility = handInProgress() ? 'visible' : 'hidden';
  chipsEl.style.visibility = handInProgress() ? 'hidden' : 'visible';
  resultStatusTxt.style.visibility = handInProgress() ? 'hidden' : 'visible';
  playagainBTN.style.visibility = !winner ? 'hidden' : 'visible';
}

function renderHand() {
  playerCardContainer.innerHTML = dealerCardContainer.innerHTML = "";
  playerHand.forEach(function (card) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${card.face}`;
    playerCardContainer.appendChild(cardEl);
  })
  dealerHand.forEach(function (card, index) {
    const cardEl = document.createElement('div');
    cardEl.className = index === 0 && handInProgress() ? `card back` : `card ${card.face}`;
    dealerCardContainer.appendChild(cardEl);
  });
}

function dealCard() {
  if (bankroll > betAtm) {
    shuffledDeck = getNewShuffledDeck();
    playerHand.push(shuffledDeck.pop(), shuffledDeck.pop());
    dealerHand.push(shuffledDeck.pop(), shuffledDeck.pop());
    // Check for Blackjack
    playerTotal = computeScoreForHand(playerHand);
    dealerTotal = computeScoreForHand(dealerHand);
    bankroll -= betAtm;
    if (dealerTotal === 21 && playerTotal === 21) {
      winner = 'P';
    } else if (dealerTotal === 21) {
      winner = 'DBJ';
    } else if (playerTotal === 21) {
      winner = 'PBJ';
    }
  } else winner = 'NM';
  render();
}

function settleBet() {
  if (winner === 'PBJ') {
    bankroll += betAtm + (betAtm * 1.5);
  } else if (winner === 'P') {
    bankroll += betAtm * 2;
  } else if (winner === 'T') {
    bankroll += betAtm;
  }
  bet = 0;
}

function addCard() {
  playerHand.push(shuffledDeck.pop());
  playerTotal = computeScoreForHand(playerHand);
  if (playerTotal > 21) {
    winner = 'D';
  }
  render();
}

function selected5() {
  betAtm = 5;
  txt.innerHTML = 5;
  renderControls();
}

function selected10() {
  betAtm = 10;
  txt.innerHTML = 10;
  renderControls();
}

function selected100() {
  betAtm = 100;
  txt.innerHTML = 100;
  renderControls();
}

function computeScoreForHand(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function (card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
}

function renderScore() {
  // Dealer Score at each round
  dealerScoreTxt.innerText = handInProgress() ? '' : computeScoreForHand(dealerHand);
  //player Score at each round
  playerScoreTxt.innerText = computeScoreForHand(playerHand);
}

function HandleStand() {
  playerTotal = computeScoreForHand(playerHand);
  dealerTotal = computeScoreForHand(dealerHand);

  while (dealerTotal < 17) {
    dealerHand.push(shuffledDeck.pop());
    dealerTotal = computeScoreForHand(dealerHand);
  }
  if (dealerTotal > 21) {
    winner = 'P';
  } else {
    if (dealerTotal === playerTotal) {
      winner = 'T';
    } else if (dealerTotal > playerTotal) {
      winner = 'D';
    } else if (dealerTotal < playerTotal) {
      if (playerTotal === 21) {
        winner = 'PBJ';
      } else winner = 'P';
    }
  }
  settleBet();
  render();
}



