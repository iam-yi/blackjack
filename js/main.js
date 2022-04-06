/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];


// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();


/*----- app's state (variables) -----*/
let shuffledDeck;
let dealerHand;
let playerHand;
let winner;
let bankroll;
let betAmt;



/*----- cached element references -----*/
const playerCardContainer = document.getElementById('playerCard');
const dealerCardContainer = document.getElementById('dealerCard');
const bankrollEl = document.querySelector('.money');
const betEl = document.getElementById('currentBet');
const chipsEl = document.getElementById('chips');

const dealBTN = document.getElementById('deal-btn');
const hitBTN = document.getElementById('hit-btn');
const standBTN = document.getElementById('stand-btn');

/*----- event listeners -----*/
dealBTN.addEventListener('click', dealCard);
hitBTN.addEventListener('click', addCard);

//Score Display
const playerScoreTxt = document.getElementById('player-score');
const dealerScoreTxt = document.getElementById('dealer-score');
const resultStatusTxt = document.getElementById('result-status');

//money button
const oneBTN = document.getElementById('chip1');
const tenBTN = document.getElementById('chip10');
const hundredBTN = document.getElementById('chip100');
const txt= document.getElementById('currentBet');

oneBTN.addEventListener('click', selected1);
tenBTN.addEventListener('click', selected10);
hundredBTN.addEventListener('click', selected100);

//button button
const resetBTN = document.getElementById('reset-btn');

resetBTN.addEventListener('click', init);
//top of button


/*----- functions -----*/
init();

function init() {
  winner = null;
  playerHand = [];
  dealerHand = [];
  bankroll = 1000;
  betAmt = 0;
  render();
}

function render() {
  renderHand();
  renderControls();
  renderScore();
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
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
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
  return !winner && playerHand.length; // game first loading
}

function renderControls() {
  dealBTN.style.visibility = !handInProgress() ? 'visible' : 'hidden';
  standBTN.style.visibility = handInProgress() ? 'visible' : 'hidden';
  hitBTN.style.visibility = handInProgress() ? 'visible' : 'hidden';
  chipsEl.style.visibility = handInProgress() ? 'hidden' : 'visible';
}

function renderHand() {
  playerCardContainer.innerHTML = dealerCardContainer.innerHTML = "";
  playerHand.forEach(function(card) {
    const cardEl = document.createElement('div'); 
    cardEl.className = `card ${card.face}`;
    playerCardContainer.appendChild(cardEl);   
  })
  dealerHand.forEach(function(card, index) {
    const cardEl = document.createElement('div'); 
    cardEl.className = index === 0 && handInProgress() ? `card back` : `card ${card.face}` ;
    dealerCardContainer.appendChild(cardEl);   
  });
}

function dealCard() {
  shuffledDeck = getNewShuffledDeck();
  playerHand.push(shuffledDeck.pop(), shuffledDeck.pop());
  dealerHand.push(shuffledDeck.pop(), shuffledDeck.pop());
  render();
}

function addCard() { 
      playerHand.push(shuffledDeck.pop());
    render();
}

function selected1() {
  txt.innerHTML = 1;
} 
  
function selected10() {
  txt.innerHTML = 10;
}

function selected100() {
  txt.innerHTML = 100;
}

function computeScoreForHand(hand) {
  let total = 0; 
  let aces = 0;
  hand.forEach(function(card) {
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

// function gameStatus() {
//   if(cardScoreResult.playerSumScore < 22 && cardScoreResult.dealerSumScore < 22) {
//     if( cardScoreResult.dealerSumScore > cardScoreResult.playerSumScore) {
//       resultStatusTxt.innerHTML = "Dealer Win!!";
//     } else {
//       resultStatusTxt.innerHTML = "You Win!!";
//     }} else if(cardScoreResult.dealerSumScore > 22) {
//       resultStatusTxt.innerHTML = "You Win!!";
//     } else {
//       resultStatusTxt.innerHTML = "Dealer Win!!";
//     }
//   render();
// }



