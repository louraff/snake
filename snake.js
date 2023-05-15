

window.addEventListener('DOMContentLoaded', init)

function init() {
  const grid = document.querySelector('.grid')
  const width = 25
  const height = 25
  const cellCount = width * height
  const cells = []

  const scoreElement = document.getElementById('score');
  const highScoreElement = document.getElementById('high-score');
  

  const hiss = new Audio('sounds/hiss.mp3');
  const takeoff = new Audio('sounds/takeoff.mp3');
  const background = new Audio('sounds/background.mp3');
  const announcement = new Audio('sounds/announcement.mp3');

  const worldRecord = '99,999'
  let highScore = localStorage.getItem('highScore') || 0

  let delay = 400;
  let intervalId;
  let score = 0000

 
  let direction = { x: 1, y: 0 }
  let snake = [
    { x: Math.floor(width / 2), y: Math.floor(height / 2) + 1 }, 
    { x: Math.floor(width / 2), y: Math.floor(height / 2) },
    { x: Math.floor(width / 2), y: Math.floor(height / 2) - 1 }
  ]

  document.addEventListener("keydown", handleUserInput)
  document.getElementById('restart-button').addEventListener('click', restartGame);
  window.addEventListener('load', () => {
    takeoff.play(); 
    takeoff.volume = 0.5
    const startScreen = document.getElementById('start-screen');
    startScreen.style.display = 'flex';


    window.addEventListener('keyup', function startGame(e) {
        startScreen.style.display = 'none';
        announcement.play();

        let containers = document.querySelectorAll('.container')
        // Show the game containers
        containers.forEach(container => {
            container.classList.remove('hide');
        });
        document.body.classList.add('game-running');
        window.removeEventListener('keyup', startGame);
        createGrid();
        background.play(); 
        background.loop = true;
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
  
    scoreElement.textContent = score;
    highScoreElement.textContent = 'High Score: ' + highScore;
    drawSnake()
    intervalId = setInterval(moveSnake, delay) 
    drawFood()
    // resetHighScore()
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
      announcement.play() 

      updateScore()
  
      if (delay > 20) {  // Only speed up if the delay is over the minimum
        delay *= 0.95;
        console.log("New delay: " + delay); 
        clearInterval(intervalId);
        intervalId = setInterval(moveSnake, delay);
      }
    } else {
      
      snake.pop()
    }
  
    drawSnake()
  }

  function gameOver() {
    background.pause(); 
    hiss.play(); 
    hiss.volume = 0.4;
    console.log('game over function called');
    clearInterval(intervalId);

   
  grid.style.display = 'none';

    scoreElement.style.display = 'none';
    highScoreElement.style.display = 'none';

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

  scoreElement.style.display = 'flex';
  highScoreElement.style.display = 'flex';

  // Redraw the grid and start the game again
  clearGrid()
  createGrid();
  background.play()
  background.loop = true;
}

  
  function randomFood() {
    let index = Math.floor(Math.random() * cells.length);

    while (cells[index].classList.contains('snake')) {
      index = Math.floor(Math.random() * cells.length);
    }
  
    return index;
}

function drawFood() {
    const foodIndex = randomFood();  
    cells[foodIndex].classList.add('food'); 
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true; 
      }
    }
    return false; 
  }

  
  function updateScore() {
    
    score++;
  
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    
    scoreElement.textContent = score;
    highScoreElement.textContent = 'High Score: ' + highScore;
  
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

  // function resetHighScore() {
  //   highScore = 0;
  //   localStorage.setItem('highScore', highScore);
  //   highScoreElement.textContent = 'High Score: ' + highScore;
  // }
  
}
