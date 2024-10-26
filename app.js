const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');
/*const randomButton = document.querySelector('#random-button') //RANDOM PLAYER SHIP */

//FLIP/ROTATE OPTIONS BY 90DEGREES
let angle = 0;
function flip() { 
const optionShips = Array.from(optionContainer.children);
    if (angle === 0) {
        angle = 90;
    } else { 
        angle = 0; //OR TERNARY VARIATION OF angle = angle === 0 ? 90 : 0
    }
    optionShips.forEach(optionShips => optionShips.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip); //WILL CALL THE (flip) FUNCTION WHEN BUTTON IS CLICKED 

//CREATE BOARD AS 10X10 BLOCK
const width = 10;

function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board'); //HEIGHT & WIDTH OF GAMEBOARD
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id = user;
        //console.log(gamesBoardContainer);

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }
    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('', 'player');
createBoard('', 'computer');

//SHIPS
class Ship {
    constructor(name, length){
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer', 2);
const cruiser = new Ship('cruiser', 3);
const submarine = new Ship('submarine', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, cruiser, submarine, battleship, carrier];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) { //CHECKS VALIDITY OF MOVES
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length //HANDLE VERTICAL
        : startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length  * width + width; //CHECKS TO MAKE SURE SHIPS STAY WITHIN THE BOUNDS OF THE BOARD

   let shipBlocks = [];

   for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
        shipBlocks.push(allBoardBlocks[Number(validStart) + i]); //HORIZONTAL PLACEMENT
    } else {
        shipBlocks.push(allBoardBlocks[Number(validStart) + i  * width]); //VERTICAL PLACEMENT
    }
}
    let valid;
    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
    } else {
        valid = shipBlocks.every((_shipBlock, index) => shipBlocks[0].id < 90 + (width + index + 1)); //VERTICAL
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
    return { shipBlocks, valid, notTaken};

}

function addShipPiece(user, ship, startId) {
   const allBoardBlocks = document.querySelectorAll(`#${user} div`);
   let randomBoolean = Math.random() < 0.5 //WILL RETURN TRUE/FALSE
   let isHorizontal = user === 'player' ? angle === 0 : randomBoolean //USE THE TRACKED FLIP STATE FOR THE PLAYER, BUT RANDOM FOR THE COMPUTER
   let randomStartIndex = Math.floor(Math.random() * width * width)
        //console.log(randomStartIndex)

   let startIndex = startId ? startId : randomStartIndex 

   //VALIDATES PLACEMENT & GETS THE BLOCKS
   const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)
      
   //PLACE SHIP IF IT'S VALID AND NOT OVERLAPPING
   if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
    });
 /*       placedShips.add(ship.name); //TRACKS THE PLACED SHIP
        placed = true; //MARKS THE SHIP AS PLACED */
    } else {
    if (user === 'computer') addShipPiece('computer', ship, startId) //RECURSIVELY ATTEMPT TO PLACE THE COMPUTER'S SHIP
    if (user === 'player') notDropped = true; //INDICATE THAT THE PLAYER SHIP PLACEMENT HAS FAILED
}
}
//ADD SHIPS TO COMPUTER'S BOARD
ships.forEach(ship => addShipPiece('computer', ship)); //DOESN'T NEED START ID BECAUSE IT'S RANDOMIZED FOR THE COMPUTER
// ADD SHIPS TO PLAYER'S BOARD
/*ships.forEach(ship => addShipPiece('player', ship, 0)); // Fixed start index for player ships
//DRAG PLAYER SHIPS*/
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver);
    playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
   }

function dragOver(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship);
}

function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShipPiece('player', ship, startId); //PASS THE FLIPPED STATE
    if (!notDropped) {
    draggedShip.remove(); //REMOVE SHIP FROM THE CONTAINER ONCE IT'S PLACED ON PLAYER BOARD
    }
}

//ADD HIGHLIGHT
function highlightArea(startIndex, ship) { //HIGHLIGHTING SHIP THAT IS BEING DRAGGED
    const allBoardBlocks = document.querySelectorAll('#player div');
    let isHorizontal = angle === 0; //CHECKS IF SHIP THAT IS BEING DRAGGED IS HORIZONTAL
    const { shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover');
            setTimeout(() => shipBlock.classList.remove('hover'), 500);
        });
    }
}

let gameOver = false;
let playerTurn;

//START GAME 
function startGame() {
    if(playerTurn === undefined) {
        if (optionContainer.children.length !=0) {
            infoDisplay.textContent = "Please place all of your ships first!";
    } else {
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        playerTurn = true;
        turnDisplay.textContent = "It's your turn.";
        infoDisplay.textContent = "The game has started.";
        }
    }
}
startButton.addEventListener('click', startGame); //LISTENS FOR THE START BUTTON TO BE CLICKED
startButton.addEventListener('click', () => { //WILL DISABLE THE RANDOMIZE SHIPS BUTTON ONCE THE GAME HAS BEEN STARTED
    randomButton.disabled = true;
});

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
    if (!gameOver) {
        if (e.target.classList.contains('taken')) { //LETS YOU KNOW IF AN ENEMY SHIP WAS HIT
            e.target.classList.add('boom');
            infoDisplay.textContent = "Enemy ship HIT!";

            let classes = Array.from(e.target.classList); //EXTRACTING THE CLASS NAMES OF THE SHIPS THAT WAS HIT
            classes = classes.filter(className => className !== 'block');
            classes = classes.filter(className => className !== 'boom');
            classes = classes.filter(className => className !== 'taken');

            playerHits.push(...classes);//RECORD THE HIT SHIPS CLASS
            checkScore('player', playerHits, playerSunkShips); //CHECKS SCORE

        } else if (!e.target.classList.contains('taken')) { //IF ENEMY SHIP MISSED
            infoDisplay.textContent = "You missed this time!";
            e.target.classList.add('empty');    
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000);
    }
}

//DEFINE THE COMPUTERS TURN
function computerGo() {
    if (!gameOver) {
        turnDisplay.textContent = "It's the computer's turn"; //INDICATES THE COMPUTER'S TURN
        infoDisplay.textContent = 'The computer is thinking....';

        //SETTING TIMEOUT FOR COMPUTERS TURN
        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll('#player div');

            if (allBoardBlocks[randomGo].classList.contains('taken') && allBoardBlocks[randomGo].classList.contains('boom')) { //WILL ALLOW COMPUTER TO TAKE ANOTHER TURN IF IT SELECTS A SPACE IT HAD ALREADY PREVIOUSLY SELECTED
                computerGo();
                return;
            } else if (allBoardBlocks[randomGo].classList.contains('taken') && !allBoardBlocks[randomGo].classList.contains('boom')) {
                allBoardBlocks[randomGo].classList.add('boom');
                infoDisplay.textContent = "Your ship has been hit!";
                let classes = Array.from(allBoardBlocks[randomGo].classList);
                classes = classes.filter(className => className !== 'block');
                classes = classes.filter(className => className !== 'boom');
                classes = classes.filter(className => className !== 'taken');
                computerHits.push(...classes);
                checkScore('computer', computerHits, computerSunkShips); //CHECKS SCORE
            } else {
                  infoDisplay.textContent = 'The enemy missed their shot, your ships are safe!';
                  allBoardBlocks[randomGo].classList.add('empty');// WILL SHOW THAT THE COMPUTER MISSED YOUR SHIPS
            }
        }, 1000); //3 SECONDS

        setTimeout(() => { //LETS PLAYER KNOW IT'S THEIR TURN
            playerTurn = true;
            turnDisplay.textContent = "It's your turn";
            infoDisplay.textContent = "Time to strike! Make your selection...";
            const allBoardBlocks = document.querySelectorAll('#computer div'); //CHECKS COMPUTER'S BOARD FOR SHIP PLACEMENT
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 1000); //3 SECONDS
    }
}
//SCORE FUNCTION
function checkScore(user, userHits, userSunkShips) { //TO CHECK THE SCORE OF THE COMPUTER/PLAYER

    function checkShip(shipName, shipLength) { //CHECKS IF A SHIP WAS HIT & WILL DISPLAY WHICH ONE IT WAS
        if (userHits.filter(storedShipName => storedShipName === shipName).length === shipLength) {
            if (user === 'player') {
                infoDisplay.textContent = `You sunk the computer's ${shipName}!`
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if (user === 'computer') {
                infoDisplay.textContent = `The computer sunk your ${shipName}!`
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName); //ADDS THE SUNKEN SHIP TO THE LIST
        }
         
    } 
    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleship', 4);
    checkShip('carrier', 5);

    console.log('computerSunkShips:', computerSunkShips);
    console.log('playerHits', playerHits);
    console.log('playerSunkShips', playerSunkShips);

    if (playerSunkShips.length === 5) {
    infoDisplay.textContent = "You sunk all of the computer's ships! YOU WON!";
    gameOver = true;
    }
    if (computerSunkShips.length === 5) {
        infoDisplay.textContent = "The computer sunk all of your ships! YOU LOST!";
        gameOver = true;   
    }

    if (gameOver) {
        infoDisplay.textContent = "GAME OVER!"
    }
}