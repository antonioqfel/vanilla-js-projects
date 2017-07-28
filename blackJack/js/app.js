'use strict';

// app state
// ===================
// These variables represent the state of our application, they tell us at
// any given moment the state of our blackjack game. You might find it useful
// to use these to debug issues by console logging them in the functions below.
var deckID = '';
var dealerCards = [];
var playerCards = [];
var playerScore = 0;
var dealerScore = 0;
var roundLost = false;
var roundWon = false;
var roundTied = false;


// game play nodes:
// ===================
// These nodes will be used often to update the UI of the game.

// assign this variable to the DOM node which has id="dealer-number"
var dealerScoreNode = document.querySelector('#dealer-number');

// select the DOM node which has id="player-number"
var playerScoreNode = document.querySelector('#player-number');

// select the DOM node which has id="dealer-cards"
var dealerCardsNode = document.querySelector('#dealer-cards');

// select the DOM node which has id="player-cards"
var playerCardsNode = document.querySelector('#player-cards');

// selec the DOM node which has id="announcement"
var announcementNode = document.querySelector('#announcement');

// selec the DOM node which has id=new-game"
var newDeckNode  = document.querySelector('#new-game');

// selec the DOM node which has id="next-hand"
var nextHandNode = document.querySelector('#next-hand');

// selec the DOM node which has id="hit-me"
var hitMeNode = document.querySelector('#hit-me');

// selec the DOM node which has id="stay"
var stayNode = document.querySelector('#stay');


// On click events
// ==================
// These events define the actions to occur when a button is clicked.
// These are provided for you and serve as examples for creating further
// possible actions of your own choosing.
newDeckNode.onclick = getNewDeck;
nextHandNode.onclick = newHand;
hitMeNode.onclick = () => hitMe('player');
stayNode.onclick = () => setTimeout(() => dealerPlays(), 600);
// ==================


// Game mechanics functions
// ========================


function getNewDeck() {
    /* This function needs to:
    1) Call the resetPlayingArea function
    2) Make a call to deckofcardsapi in order to retrieve a new deck_id
    3) Set the value of our state variable deckID to the retrieved deck_id
    4) Change the display property of style on the nextHandNode element in order
    to provide the player with the Next Hand button.
    5) Hide the hit-me and stay buttons by changing their style.display to "none"
    6) Catch any errors that may occur on the fetch and log them */

    // 1. Call the resetPlayingArea function
    resetPlayingArea();

    // 2. Make a call to deckofcardsapi in order to retrieve a new deck_id
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
        .then(response => response.json())
        .then(data => {

            console.log('This is my data: ', data);
            console.log('This is deck id: ', data.deck_id);


            // 3.Set the value of our state variable deckID to the retrieved deck_id
            deckID = data.deck_id;
            console.log('Variable deckID: ', deckID)

            // 4. Change the display property of style on the nextHandNode element in order
            // to provide the player with the Next Hand button.
            nextHandNode.style.display = 'block';

            // 5. Hide the hit-me and stay buttons by changing their style.display to "none"
            hitMeNode.style.display = 'none';
            stayNode.style.display = 'none';
        })

        // 6. Catch any errors that may occur on the fetch and log them */
        .catch(error => {
            console.log(error);
    });


}

function computeScore(cards) {
    // This function receives an array of cards and returns the total score.

    var total =0;
    
    // Loop through the array of cars
    cards.forEach(function (card) {
        total += parseInt(card.value);
    })

    return total;
}


function newHand() {
    /* This function needs to:
    1) Call the resetPlayingArea function
    2) Make a call to deckofcardsapi using the deckID state variale in order
    to retrieve draw 4 cards from the deck.
    3) Once 4 cards have been drawn, push 2 of them to our dealerCards state
    array and 2 to our playerCards state array.
    4) Set our dealerScore state variable to "?" and then set the textContent
    value of the dealerScoreNode to dealerScore;
    5) ForEach card in playerCards and dealerCards, create an <img> element
    and assign the src of these to their respective card images. Don't forget to
    append these newly created <img> elements to the respective #dealer-cards and
    #player-cards DOM elements in order to have them show up in the html.
    6) Finally, compute the player's score by calling computeScore() and update
    the playerScoreNode to reflect this.
    7) If player score is 21, announce immediate victory by setting:
    roundWon = true;
    announcementNode.textContent = "BlackJack! You Win!";
    8) catch and log possible error from the fetch.
    */

    // 1. Call the resetPlayingArea function
    resetPlayingArea();

    /* 2. Make a call to deckofcardsapi using the deckID state variale in order
          to retrieve draw 4 cards from the deck. */
    return fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=4`)
        .then(response => response.json())
        .then(data => {

            /* 3. Once 4 cards have been drawn, push 2 of them to our dealerCards state
                  array and 2 to our playerCards state array. */
            dealerCards.push(data.cards[0]);
            dealerCards.push(data.cards[1]);
            playerCards.push(data.cards[2]);
            playerCards.push(data.cards[3]);

            /* 4. Set our dealerScore state variable to "?" and then set the textContent
               value of the dealerScoreNode to dealerScore */
            dealerScore = '?';
            dealerScoreNode.textContent = dealerScore;

            /* 5) ForEach card in playerCards and dealerCards, create an <img> element
                  and assign the src of these to their respective card images. Don't forget to
                  append these newly created <img> elements to the respective #dealer-cards and
                  #player-cards DOM elements in order to have them show up in the html. */

            // Loop through the array of playerCards
            playerCards.forEach(function (element) {

                // Create element <img> and set attribute src and alt
                var image = document.createElement('img');
                image.setAttribute('src', element.image);
                image.setAttribute('alt', element.code);

                // Append <img> to dealerCardsNode
                playerCardsNode.appendChild(image);
            });

            // Loop through the array of playerCards
            dealerCards.forEach(function (element) {

                // Create element <img> and set attribute src and alt
                var image = document.createElement('img');
                image.setAttribute('src', element.image);
                image.setAttribute('alt', element.code);

                // Append <img> to dealerCardsNode
                dealerCardsNode.appendChild(image);
            });

            /* 6. Finally, compute the player's score by calling computeScore() and update
                  the playerScoreNode to reflect this. */
            playerScore = computeScore(playerCards);
            dealerScore = computeScore(dealerCards);

            playerScoreNode.textContent = playerScore;

            // 7. If player score is 21, announce immediate victory by setting: roundWon = true;
            if (playerScore === 21) {
                roundWon = true;
            }
        })
        // 8. Catch and log possible error from the fetch.
        .catch(err => {
            console.log(err);
        })
}


function resetPlayingArea() {
    /* This function needs to:
    1) Reset all state variables to their defaults
    2) Reset the gameplay UI by updating textContent of all Nodes which may
    be displaying data from a previous round in the game. (ex: dealerScoreNode)
    3) Remove all <img> elements inside dealerCardsNode and playerCardsNode.
    */

    // Reset all state variables to their defaults
    dealerCards = [];
    playerCards = [];
    playerScore = 0;
    dealerScore = 0;
    roundLost = false;
    roundWon = false;
    roundTied = false;

    // 2. Reset the gameplay UI by updating textContent of all Nodes which may
    // be displaying data from a previous round in the game. (ex: dealerScoreNode)
    playerScoreNode.textContent = '';

    // 3. Remove all <img> elements inside dealerCardsNode and playerCardsNode.

    //dealerCardsNode.textContent ="";
    //playerCardsNode.textContent ="";

    while(dealerCardsNode.firstChild) {
        dealerCardsNode.removeChild(dealerCardsNode.firstChild)
    }

    while(playerCardsNode.firstChild) {
        playerCardsNode.removeChild(playerCardsNode.firstChild)
    }

}


function hitMe(target) {
    /* This function needs to:
    1) If any of roundLost or roundWon or roundTied is true, return immediately.
    2) Using the same deckID, fetch to draw 1 card
    3) Depending on weather target is 'player' or 'dealer', push the card to the
    appropriate state array (playerCards or dealerCards).
    4) Create an <img> and set it's src to the card image and append it to the
    appropriate DOM element for it to appear on the game play UI.
    5) If target === 'player', compute score and immediately announce loss if
    score > 21 by setting:
    roundLost = true;
    and updating announcementNode to display a message delivering the bad news.
    6) If target === 'dealer', just call the dealerPlays() function immediately
    after having appended the <img> to the game play UI.
    7) Catch error and log....
    */
}

function dealerPlays() {
    /* This function needs to:
    1) If any of roundLost or roundWon or roundTied is true, return immediately.
    2) Compute the dealer's score by calling the computeScore() function and
    update the UI to reflect this.
    */

    if (dealerScore < 17) {
        // a delay here makes for nicer game play because of suspence.
        setTimeout(()=>hitMe('dealer'), 900)
    }
    else if (dealerScore > 21) {
        roundWon = true;
        // ... Update the UI to reflect this...
    }
    else if (dealerScore > playerScore) {
        roundLost = true;
        // ... Update the UI to reflect this...
    }
    else if (dealerScore === playerScore) {
        roundTied = true;
        // ... Update the UI to reflect this...
    }
    else {
        roundWon = true;
        // ... Update the UI to reflect this...
    }

}