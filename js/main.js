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


/*----- cached element references -----*/
const cardContainer = document.getElementById('card');



/*----- event listeners -----*/
const dealBTN = document.getElementById('deal-btn');
const hitBTN = document.getElementById('hit-btn');
const resetBTN = document.getElementById('reset-btn');

dealBTN.addEventListener('click', dealCard);
hitBTN.addEventListener('click', addCard);
resetBTN.addEventListener('click', init);




/*----- functions -----*/
init();

function init() {
  shuffledDeck = getNewShuffledDeck();
  render ();
}

function render() {
  console.log(shuffledDeck);
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

function dealCard() {
  createCard();
  createCard();

  if (dealBTN.style.display !== "none") {
      dealBTN.style.display = "none";
  } 
}

function addCard() {
  createCard();
}

function createCard() {
   
    const cardEl = document.createElement('div'); 
    cardEl.className = `card ${shuffledDeck[Math.floor(Math.random()*shuffledDeck.length)].face}`;
    cardContainer.appendChild(cardEl);   
}







