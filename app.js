const userGrid = document.querySelector('.grid-user');
const computerGrid = document.querySelector('.grid-computer');
const shipGrid = document.querySelector('.grid-ships');
const ships = document.querySelectorAll('.ship');
const destroyer = document.querySelector('.destroyer-container');
const submarine = document.querySelector('.submarine-container');
const cruiser = document.querySelector('.cruiser-container');
const battleship = document.querySelector('.battleship-container');
const carrier = document.querySelector('.carrier');
const startButton = document.querySelector('#start');
const rotateButton = document.querySelector('#rotate');
const refreshButton = document.querySelector('#refresh');
const turnDisplay = document.querySelector('#whose-turn');
const infoDisplay = document.querySelector('#info');
const setupButtons = document.querySelector('#setup-buttons');
const nameInput = document.querySelector('#name');
const beforePlayFields = document.querySelectorAll('.before-play');
const onPlayFields = document.querySelectorAll('.on-play');
const nameDisplay = document.querySelector('#name-display')
// const progressRows = document.querySelectorAll('tr');
const width = 10;
const userSquares = [];
const computerSquares = [];
let isHorizontal = true;
let isGameOver = false;
let currentPlayer = 'user';
let ready = false;
let enemyReady = false;
let allShipsPlaced = false;
let shotFired = -1;
let direction;
const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]

// Create Board
function createBoard(grid, squares, width) {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.dataset.id = i; // set the id of div
    grid.appendChild(square); // add div to the HTML
    squares.push(square); // add div to the array
  }
}

createBoard(userGrid, userSquares, width); // create user squares


// Ships
const shipArray = [
  {
    name: 'destroyer',
    directions: [
      [0, 1], // horizontal
      [0, 10] // vertical
    ]
  },
  {
    name: 'submarine',
    directions: [
      [0, 1, 2],
      [0, 10, 20]
    ]
  },
  {
    name: 'cruiser',
    directions: [
      [0, 1, 2],
      [0, 10, 20]
    ]
  },
  {
    name: 'battleship',
    directions: [
      [0, 1, 2, 3],
      [0, 10, 20, 30]
    ]
  },
  {
    name: 'carrier',
    directions: [
      [0, 1, 2, 3, 4],
      [0, 10, 20, 30, 40]
    ]
  },
]

// Draw the computers ships in random locations
function generate(ship) {
  let rand = Math.floor(Math.random() * 2); // 0 or 1
  let current = ship.directions[rand];
  if (rand = 0) direction = 1; // horizontal
  if (rand = 1) direction = 10; // vertical (add 10 to index everytime)

  let randomStart = Math.abs(Math.floor(Math.random() * 100) - ship.directions[0].length * direction);
  const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
  const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
  const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);
  // some() tests whether at least one element in the array passes the test
  // Generation:
  if (!isTaken && !isAtLeftEdge && !isAtRightEdge)
    current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name));
  else
    generate(ship);
}

// Rotate the ships
function rotate() {
  console.log(ships)
  ships.forEach(ship => {
    ship.classList.toggle('ship-vertical');
  });
  isHorizontal = !isHorizontal;
  console.log(isHorizontal)
}

rotateButton.addEventListener('click', rotate);

// Move around user ship
ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
userSquares.forEach(square => square.addEventListener('dragstart', dragStart));
userSquares.forEach(square => square.addEventListener('dragover', dragOver));
userSquares.forEach(square => square.addEventListener('dragenter', dragEnter));
userSquares.forEach(square => square.addEventListener('drop', dragDrop));

let selectedShipNameWithId; // e.g. destroyer-0
let draggedShip; //e.g. .destroyer-container
let draggedShipLength; // e.g. 2

ships.forEach(ship => ship.addEventListener('mousedown', e => {
  selectedShipNameWithId = e.target.id; // e.g. destroyer-0
  //console.log(selectedShipNameWithIndex);
}))

function dragStart() {
  draggedShip = this;
  //console.log(draggedShip)
  draggedShipLength = this.childNodes.length;
  //console.log(draggedShipLength)
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragDrop() {
  let shipNameWithLastSquareId = draggedShip.lastChild.id; // e.g. destroyer-1
  let shipClass = shipNameWithLastSquareId.slice(0, -2); // e.g. destroyer
  let lastSquareId = parseInt(shipNameWithLastSquareId.substr(-1)); // e.g. 1 (destroyer has 0 and 1)
  let selectedShipId = parseInt(selectedShipNameWithId.substr(-1)); // e.g. 0
  // selectedShipNameWithIndex e.g. destroyer-0
  let lastSquareIndex = lastSquareId + parseInt(this.dataset.id) - selectedShipId; // e.g. 83 + 1 - 0
  // Last square cannot go there:
  const notAllowedHorizontal = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 22, 32, 42, 52, 62, 72, 82, 92, 102, 13, 23, 33, 43, 53, 63, 73, 83, 93, 103]
  const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60]
  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastSquareId);
  let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastSquareId);

  if (isHorizontal && !newNotAllowedHorizontal.includes(lastSquareIndex)) { // if ship is horizontal and in valid position
    for (let i = 0; i < draggedShipLength; i++) {
      //debugger;
      userSquares[parseInt(this.dataset.id) - selectedShipId + i].classList.add('taken', shipClass)
    }
  } else if (!isHorizontal && !newNotAllowedVertical.includes(lastSquareIndex)) { // if ship is vertical and in valid position
    for (let i = 0; i < draggedShipLength; i++) {
      //debugger;
      userSquares[parseInt(this.dataset.id) - selectedShipId + width * i].classList.add('taken', shipClass)
    }
  } else return;
  //As long as the index of the ship we are dragging is not in the newNotAllowedVertical array. If we drag the ship by its
  //index-1 , index-2 and so on, the ship will rebound back to the shipGrid.

  shipGrid.removeChild(draggedShip);
  if (!shipGrid.querySelector('.ship')) {
    allShipsPlaced = true;
    shipGrid.style.display = 'none';
    rotateButton.style.display = 'none';
  }
}

function makeMove() {
  if (isGameOver) return;
  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Turn';
    computerSquares.forEach(square => square.addEventListener('click', e => {
      shotFired = square.dataset.id;
      if (square.classList.contains('hit') || square.classList.contains('miss')) {
        alert("Stop wasting your torpedos! You already fired at this location.");
        makeMove(); // run function again recursively
        return;
      }
      openSquare(square.classList);
    }));
  }
  if (currentPlayer === 'enemy') {
    turnDisplay.innerHTML = `Computer's Turn`;
    setTimeout(enemyTurn, 150);
  }
}
startButton.addEventListener('click', () => {
  startGame();

});

function startGame() {

  // Check if we can start the game
  if (shipGrid.children.length > 0) { // hasChildNodes() can read white space, so using length
    alert('Please drag your ships to the board before starting the game.')
    return;
  } else if (nameInput.value === '') {
    alert('Please enter your name.')
    return;
  }

  // Adjust display below the board
  for (field of beforePlayFields)
    field.style.display = 'none'; // hide intro HTML
  for (field of onPlayFields) {
    field.style.display = 'block'; // show match info
    computerGrid.style.display = 'grid'; // display computer grid
    nameDisplay.parentNode.style.display = 'flex';
  }
  infoDisplay.innerHTML = `Hello, ${nameInput.value}! Let's play.`
  nameDisplay.innerHTML = nameInput.value;

  // Create computer grid
  createBoard(computerGrid, computerSquares, width); // create computer squares
  shipArray.forEach(ship => {
    generate(ship);
  });

  // Initiate the first move
  makeMove();
}



let destroyerCount = 0;
let submarineCount = 0;
let cruiserCount = 0;
let battleshipCount = 0;
let carrierCount = 0;

/*
class Player {
  constructor() {
    destroyerCount = 0;
    submarineCount = 0;
    cruiserCount = 0;
    battleshipCount = 0;
    carrierCount = 0;
  }
  getDestroyerCount() {
    return destroyerCount;
  }
}
let computer = new Player();
let user = new Player();
console.log(computer.getDestroyerCount());
*/


function openSquare(classList) {
  const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`); // square.dataset.id
  const obj = Object.values(classList); // Object.values() returns array of given object's property values
  if (!enemySquare.classList.contains('hit')
    && !enemySquare.classList.contains('miss')
    && currentPlayer === 'user'
    && !isGameOver) {
    if (obj.includes('destroyer')) destroyerCount++;
    if (obj.includes('submarine')) submarineCount++;
    if (obj.includes('cruiser')) cruiserCount++;
    if (obj.includes('battleship')) battleshipCount++;
    if (obj.includes('carrier')) carrierCount++;
  }
  if (obj.includes('taken')) {
    enemySquare.classList.add('hit');
  } else {
    enemySquare.classList.add('miss');
  }
  checkForWins();
  currentPlayer = 'enemy';
  makeMove(); // make enemy move
}


let cpuDestroyerCount = 0;
let cpuSubmarineCount = 0;
let cpuCruiserCount = 0;
let cpuBattleshipCount = 0;
let cpuCarrierCount = 0;


function enemyTurn(square) {
  square = Math.floor(Math.random() * userSquares.length); // which square to attack?
  if (userSquares[square].classList.contains('hit')) { // 
    enemyTurn(); // if already shot at, try again
  } else {
    const hit = userSquares[square].classList.contains('taken')
    userSquares[square].classList.add(hit ? 'hit' : 'miss')
    if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++
    if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++
    if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++
    if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++
    if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++
    checkForWins()
  }
  currentPlayer = 'user'; // user's turn
  turnDisplay.innerHTML = 'Your turn';
}

function checkForWins() {
  let enemy = 'computer';
  //console.log(progressRows.filter(':text[value=""]'))
  if (destroyerCount === 2) {
    infoDisplay.innerHTML = `The computer's destroyer is sunk`;
  }
  if (submarineCount === 3) {
    infoDisplay.innerHTML = `The computer's submarine is sunk`;
  }
  if (cruiserCount === 3) {
    infoDisplay.innerHTML = `The computer's cruiser is sunk`;
  }
  if (battleshipCount === 4) {
    infoDisplay.innerHTML = `The computer's battleship is sunk`;
  }
  if (carrierCount === 5) {
    infoDisplay.innerHTML = `The computer's carrier is sunk`;
  }
  if (cpuDestroyerCount === 2) {
    infoDisplay.innerHTML = `Computer sunk your destroyer`;
  }
  if (cpuSubmarineCount === 3) {
    infoDisplay.innerHTML = `Computer sunk your submarine`;
  }
  if (cpuCruiserCount === 3) {
    infoDisplay.innerHTML = `Computer sunk your cruiser`;
  }
  if (cpuBattleshipCount === 4) {
    infoDisplay.innerHTML = `Computer sunk your battleship`;
  }
  if (cpuCarrierCount === 5) {
    infoDisplay.innerHTML = `Computer sunk your carrier`;
  }

  if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 17) {
    turnDisplay.innerHTML = "";
    infoDisplay.innerHTML = "CONGRATULATIONS! YOU WIN";
    gameOver();
  }
  if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 17) {
    turnDisplay.innerHTML = "";
    infoDisplay.innerHTML = `OH NO! ${enemy.toUpperCase()} WINS`;
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  startButton.removeEventListener('click', makeMove);
  // computerSquares.forEach(square => square.removeEventListener('click'
}




// const isOverflowing = () => {
//   if (direction = 1) return (ship.directions[0].length + (randomStart % width)) >= width;
//   if (direction = 10) return randomStart % width >= width;
// }