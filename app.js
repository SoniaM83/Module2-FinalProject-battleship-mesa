const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');

//FLIP/ROTATE OPTIONS BY 90DEGREES
let angle = 0;
function flip() {
const optionShips = Array.from(optionContainer.children);
    angle = angle === 0 ? 90 : 0;
    optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`);
}

flipButton.addEventListener('click', flip); //will call the (flip) function when button is clicked

//Create board AS 10X10 BLOCK
const width = 10;

function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board'); //height & width of gameboard
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id = user;

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }

    gamesBoardContainer.append(gameBoardContainer);
}

createBoard('pink', 'player');
createBoard('lightgreen', 'computer');

//ships
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

function addShipPiece() {
   const allBoardBlocks = document.querySelectorAll('#computer div');
   let randomStartIndex = Math.floor(Math.random() * width * width);
}
addShipPiece()