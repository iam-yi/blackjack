/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const chip1 = 1;
const chip10 = 10;
const chip100 = 100;

// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();


/*----- app's state (variables) -----*/
let shuffledDeck = [];
let dealerHand = [];
let playerHand = [];



/*----- cached element references -----*/
const playerCardContainer = document.getElementById('playerCard');
const dealerCardContainer = document.getElementById('dealerCard');

/*----- event listeners -----*/
//top of button
const dealBTN = document.getElementById('deal-btn');
const hitBTN = document.getElementById('hit-btn');
const standBTN = document.getElementById('stand-btn');

dealBTN.addEventListener('click', dealCard);
hitBTN.addEventListener('click', addCard);
//standBTN.addEventListener('click', cardScoreResult);

//Score Display
const playerScoreTxt = document.getElementById('player-score');
const dealerScoreTxt = document.getElementById('dealer-score');

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
  shuffledDeck = getNewShuffledDeck();
}

function render() {
  console.log(shuffledDeck);
  renderHand();
}

function getNewShuffledDeck() {
  // Create a copy of the masterDeck (leave masterDeck untouched!)
  const tempDeck = [...masterDeck];

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

function renderHand() {
  clearRenderHand();
  playerHand.forEach(function(card) {
    const cardEl = document.createElement('div'); 
    cardEl.className = `card ${card.face}`;
    playerCardContainer.appendChild(cardEl);   
  })
  dealerHand.forEach(function(card, index) {
    const cardEl = document.createElement('div'); 
    cardEl.className = index === 0 ? `card ${card.face}` : `card back`
    dealerCardContainer.appendChild(cardEl);   
  });
  cardScoreResult();
}

function clearRenderHand() {
  Array.from(playerCardContainer.children).forEach(function(child) {
    playerCardContainer.removeChild(child);
  });

  Array.from(dealerCardContainer.children).forEach(function(child) {
    dealerCardContainer.removeChild(child);
  });
}

function dealCard() {
  for(let i = 0; i<2; i++){
    playerHand.push(shuffledDeck.pop());
    dealerHand.push(shuffledDeck.pop());
  }
  if (dealBTN.style.display !== "none") {
    dealBTN.style.display = "none";
  } 
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

function cardScoreResult() {
  // Dealer Score at each round
  const dealerSumScore = dealerHand.reduce(function(acc, cur) {
    return acc + cur.value;
  }, 0);
  dealerScoreTxt.innerText = dealerSumScore;
  //player Score at each round
  const playerSumScore = playerHand.reduce(function(acc, cur) {
      return acc + cur.value;
  }, 0);
  playerScoreTxt.innerText = playerSumScore;

  render();
}



