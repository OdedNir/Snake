const gridSize = 30; // Sets the grid dimensions as one value
const initLength = 3;
let canvas; // Canvas element
let ctx; // Canvas context
let direction; // Snake direction, right is default
let currentPos; // The current position of the Snake's head, as xy coordinates
let suggestedPos; // The suggested position for the Snake's food
let interval; // Animation based on the 'moveSnake' function
let snakeBody = []; // Snake's body coordinates
let snakeLength = initLength;
let score; // Score of current game
let started = false; // Indicates if the game is running

let scoreElem = document.getElementById('score');

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

const checkSupported = () => {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        // Canvas is supported        
        interval = setInterval(moveSnake, 80);
        currentPos = [0,0];
        makeFood();
        drawSnake();
    } else {
        // Canvas is not supported
        alert("We're sorry, but your browser does not support the canvas tag. Please use any web browser other than Internet Explorer.");
    }
};

const startGame = () => {
    if (!started) {
        checkSupported();
        allowPress = true;
        started = true;
        direction = 'right';
    }
};

document.addEventListener("keydown", (e) => {
    if (started) {
        switch (e.key) {
            // left
            case 'ArrowLeft':
                if (direction != 'right' && direction != 'left') {
                    direction = 'left';
                }
                break;
            // up
            case 'ArrowUp':
                if (direction != 'down' && direction != 'up') {
                    direction = 'up';
                }
                break;
            // right
            case 'ArrowRight':
                if (direction != 'right' && direction != 'left') {
                    direction = 'right';
                }
                break;
            // down
            case 'ArrowDown':
                if (direction != 'down' && direction != 'up') {
                    direction = 'down';
                }
                break;
            default:
                break;
        }
    }
});

const drawSnake = () => {
    if (snakeBody.some(hasEatenItself)) {
        gameOver();
        return false;
    }
    snakeBody.push([currentPos[0], currentPos[1]]);
    ctx.fillStyle = "red"; // Red
    ctx.fillRect(currentPos[0], currentPos[1], gridSize, gridSize);
    if (snakeBody.length > snakeLength) {
        let itemToRemove = snakeBody.shift();
        ctx.clearRect(itemToRemove[0], itemToRemove[1], gridSize, gridSize);
    }
    if (currentPos[0] == suggestedPos[0] && currentPos[1] == suggestedPos[1]) {
        makeFood();
        snakeLength += 1;
        scoreElem.innerHTML = "Score: " + (snakeLength - initLength);
    }
};

const hasEatenItself = (element, index, array) => {
    return (element[0] == currentPos[0] && element[1] == currentPos[1]);
};

const makeFood = () => {
    suggestedPos = [Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize, Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize];
    if (taken(suggestedPos)) {
        makeFood();
    } else {
        ctx.fillStyle = "green"; // Green
        ctx.fillRect(suggestedPos[0], suggestedPos[1], gridSize, gridSize);
    }
};

const taken = (sugPos) => {
    for (const pos in snakeBody) {
        if (pos[0] == sugPos[0] && pos[1] == sugPos[1]) {
            return true;
        }
    }
    return false;
};

const moveSnake = () => {
    switch (direction) {
        case 'up':
            currentPos[1] = (currentPos[1] - gridSize + canvas.height) % canvas.height;
            drawSnake();
            break;
        case 'down':
            currentPos[1] = (currentPos[1] + gridSize + canvas.height) % canvas.height;
            drawSnake();
            break;
        case 'left':
            currentPos[0] = (currentPos[0] - gridSize + canvas.width) % canvas.width;
            drawSnake();
            break;
        case 'right':
            currentPos[0] = (currentPos[0] + gridSize + canvas.width) % canvas.width;
            drawSnake();
            break;
    }
};

const gameOver = () => {
    started = false;
    score = snakeLength - 3;
    scoreElem.innerHTML = "Score: 0";
    clearInterval(interval);
    snakeBody = [];
    snakeLength = initLength;
    alert("Game Over! Your Score is: " + score);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};