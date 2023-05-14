let delay = 400;
let intervalId;

window.addEventListener('DOMContentLoaded', init)

function init() {
  const grid = document.querySelector('.grid')
  const width = 25
  const height = 25
  const cellCount = width * height
  const cells = []

  const worldRecord = '99,999'
  let highScore = localStorage.getItem('highScore') || 0

  let score = 0000


  let direction = { x: 1, y: 0 }
  let snake = [
    { x: Math.floor(width / 2), y: Math.floor(height / 2 + 1) }, // Snake starts at the center of the grid
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) - 1 }
  ]

  document.addEventListener("keydown", handleUserInput)
  document.getElementById('restart-button').addEventListener('click', restartGame);
  window.addEventListener('load', () => {
    const startScreen = document.getElementById('start-screen');
    startScreen.style.display = 'flex';

    window.addEventListener('keyup', function startGame(e) {
        startScreen.style.display = 'none';

        let containers = document.querySelectorAll('.container')
        // Show the game containers
        containers.forEach(container => {
            container.classList.remove('hide');
        });
        document.body.classList.add('game-running');
        window.removeEventListener('keyup', startGame);
        createGrid();
    });
});


  function createGrid() {
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      cell.id = i
      cell.dataset.index = i
      cell.style.height = `${100 / height}%`
      cell.style.width = `${100 / width}%`
      grid.appendChild(cell)
      cells.push(cell)
    }
    drawSnake()
    intervalId = setInterval(moveSnake, delay) // Game loop, moving the snake every 200ms
    drawFood()
  }

  function clearSnake() {
    for(let segment of snake){
      let index = segment.y * width + segment.x
      cells[index].classList.remove('snake')
    }
  }

  function drawSnake() {
    for(let segment of snake){
      let index = segment.y * width + segment.x
      cells[index].classList.add('snake')
    }
  }


  function moveSnake() {
    clearSnake()
  
    let newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    }

    if (
      newHead.x < 0 || 
      newHead.y < 0 || 
      newHead.x >= width || 
      newHead.y >= height || 
      checkSelfCollision(newHead)
    ) {
      return gameOver()
    }
  

    snake.unshift(newHead)
  
    // Check if the next cell contains food
    if (cells[newHead.y * width + newHead.x].classList.contains('food')) {
      // Remove the food
      cells[newHead.y * width + newHead.x].classList.remove('food');
      drawFood()

      updateScore()
  
      if (delay > 20) {  // Only speed up if the delay is over the minimum
        delay -= 30;
        console.log("New delay: " + delay);  // Log the new delay
        clearInterval(intervalId);
        intervalId = setInterval(moveSnake, delay);
      }
    } else {
      // Only remove the tail segment if the snake didn't eat food
      snake.pop()
    }
  
    drawSnake()
  }
  
function restartGame() {
    console.log('restartGame() has been called');

    const grid = document.querySelector('.grid')
    grid.style.display = 'flex';
      // Hide the game over screen
  const gameOverScreen = document.getElementById('gameover-screen');
  gameOverScreen.style.display = 'none';
  console.log('gameOverScreen display is now ' + gameOverScreen.style.display);


  // Reset game variables
  score = 0;
  direction = { x: 1, y: 0 };
  snake = [
    { x: Math.floor(width / 2), y: Math.floor(height / 2 + 1) },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) - 1 }
  ];

  delay = 400;
  clearInterval(intervalId);
  intervalId = setInterval(moveSnake, delay);

  // Redraw the grid and start the game again
  clearGrid()
  createGrid();
}

  
  
  function randomFood() {
    let index = Math.floor(Math.random() * cells.length);
  
    // While the randomly selected cell is part of the snake, choose a new random cell
    while (cells[index].classList.contains('snake')) {
      index = Math.floor(Math.random() * cells.length);
    }
  
    return index;
}

function drawFood() {
    const foodIndex = randomFood();  // Get a random index for the food
    cells[foodIndex].classList.add('food');  // Add the food class to the cell
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true; // Collision with self detected
      }
    }
    return false; // No collision with self
  }

  function gameOver() {
    console.log('game over function called');
    clearInterval(intervalId);

    const grid = document.querySelector('.grid')
  grid.style.display = 'none';

    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');

    scoreElement.textContent = score;
    highScoreElement.textContent = 'High Score: ' + highScore;

     // Show the game over screen
  const gameOverScreen = document.getElementById('gameover-screen');
  gameOverScreen.style.display = 'block';
  console.log('gameOverScreen display is now ' + gameOverScreen.style.display);

  // Update the scores on the game over screen
  document.getElementById('gameover-score').textContent = 'Score: ' + score;
  document.getElementById('gameover-high-score').textContent = 'High Score: ' + highScore;

  document.getElementById('gameover-world-record').textContent = 'World Record: ' + worldRecord;
  }

  function updateScore() {
    // Increase the score
    score++;
  
    // Update the high score if necessary
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
  
    // Update the score display
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('high-score');
  
    scoreElement.textContent = score;
    highScoreElement.textContent = 'High Score: ' + highScore;
  }
  
  function displayHighScores(highScores) {
    // Get the high scores div
    const highScoresDiv = document.getElementById('high-scores');
  
    // Clear out the current contents
    highScoresDiv.innerHTML = '';
  
    // Create a new list
    const list = document.createElement('ul');
  
    // Add a title to the list
    const title = document.createElement('li');
    title.textContent = 'High Scores';
    list.appendChild(title);
  
    // Add each high score to the list
    for(let i = 0; i < highScores.length; i++) {
      const listItem = document.createElement('li');
      listItem.textContent = 'Score ' + (i + 1) + ': ' + highScores[i];
      list.appendChild(listItem);
    }
  
    // Add the list to the high scores div
    highScoresDiv.appendChild(list);
  }

  function handleUserInput(event) {
    const key = event.keyCode
    const up = 38
    const down = 40
    const left = 37
    const right = 39
  
    let newDirection = direction
  
    if (key === left) {
      newDirection = { x: -1, y: 0 }
    } else if (key === right) {
      newDirection = { x: 1, y: 0 }
    } else if (key === down) {
      newDirection = { x: 0, y: 1 }
    } else if (key === up) {
      newDirection = { x: 0, y: -1 }
    } else {
      return
    }
  
    // Check if the new direction is the opposite of the current direction
    if (newDirection.x + direction.x !== 0 || newDirection.y + direction.y !== 0) {
      direction = newDirection
    }
  }

  function clearGrid() {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      cell.parentNode.removeChild(cell);
    }
    cells.length = 0;
  }
  
}
