// Snake Game - Built with vanilla JavaScript and HTML5 Canvas

(function () {
    // Game variables
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('snakeScore');
    const startBtn = document.getElementById('snakeStartBtn');
    const pauseBtn = document.getElementById('snakePauseBtn');

    // Game constants
    const GRID_SIZE = 20;
    const TILE_COUNT = canvas.width / GRID_SIZE;

    // Game state
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;
    let nextDx = 1;
    let nextDy = 0;
    let score = 0;
    let gameRunning = false;
    let gamePaused = false;
    let gameSpeed = 100; // milliseconds
    let gameLoopId = null;

    /**
     * Draw a tile on the canvas
     */
    function drawTile(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    }

    /**
     * Draw the entire game state
     */
    function draw() {
        // Clear canvas with semi-transparent background
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-light');
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Head - bright color
                drawTile(segment.x, segment.y, getComputedStyle(document.documentElement).getPropertyValue('--accent-color'));
            } else {
                // Body - slightly darker
                drawTile(segment.x, segment.y, getComputedStyle(document.documentElement).getPropertyValue('--secondary-color'));
            }
        });

        // Draw food
        drawTile(food.x, food.y, '#ff6b6b');
    }

    /**
     * Update game state
     */
    function update() {
        if (gamePaused || !gameRunning) return;

        // Update direction
        dx = nextDx;
        dy = nextDy;

        // Calculate new head position
        const head = snake[0];
        let newX = head.x + dx;
        let newY = head.y + dy;

        // Wrap around edges
        newX = (newX + TILE_COUNT) % TILE_COUNT;
        newY = (newY + TILE_COUNT) % TILE_COUNT;

        // Check collision with self
        if (snake.some(segment => segment.x === newX && segment.y === newY)) {
            endGame();
            return;
        }

        // Add new head
        snake.unshift({ x: newX, y: newY });

        // Check if food eaten
        if (newX === food.x && newY === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            spawnFood();
            // Increase speed slightly
            if (gameSpeed > 50) gameSpeed -= 1;
        } else {
            // Remove tail if no food eaten
            snake.pop();
        }
    }

    /**
     * Spawn food at random location
     */
    function spawnFood() {
        let newFood;
        let foodOnSnake = true;

        while (foodOnSnake) {
            newFood = {
                x: Math.floor(Math.random() * TILE_COUNT),
                y: Math.floor(Math.random() * TILE_COUNT)
            };
            foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }

        food = newFood;
    }

    /**
     * Start the game loop
     */
    function startGameLoop() {
        if (gameLoopId) clearInterval(gameLoopId);

        gameLoopId = setInterval(() => {
            update();
            draw();
        }, gameSpeed);
    }

    /**
     * Start new game
     */
    function startGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        nextDx = 1;
        nextDy = 0;
        score = 0;
        gameSpeed = 100;
        gameRunning = true;
        gamePaused = false;

        scoreDisplay.textContent = score;
        startBtn.textContent = 'Restart Game';
        pauseBtn.textContent = 'Pause';
        pauseBtn.disabled = false;

        spawnFood();
        draw();
        startGameLoop();
    }

    /**
     * End game
     */
    function endGame() {
        gameRunning = false;
        clearInterval(gameLoopId);
        startBtn.textContent = 'Start Game';
        pauseBtn.disabled = true;

        // Draw game over message
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    }

    /**
     * Toggle pause
     */
    function togglePause() {
        if (!gameRunning) return;

        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';

        if (!gamePaused) {
            startGameLoop();
        } else {
            clearInterval(gameLoopId);
        }
    }

    /**
     * Handle keyboard input
     */
    function handleKeyPress(e) {
        if (!gameRunning) return;

        const key = e.key.toLowerCase();

        // Arrow keys and WASD controls
        if (key === 'arrowup' || key === 'w') {
            if (dy === 0) { nextDx = 0; nextDy = -1; e.preventDefault(); }
        } else if (key === 'arrowdown' || key === 's') {
            if (dy === 0) { nextDx = 0; nextDy = 1; e.preventDefault(); }
        } else if (key === 'arrowleft' || key === 'a') {
            if (dx === 0) { nextDx = -1; nextDy = 0; e.preventDefault(); }
        } else if (key === 'arrowright' || key === 'd') {
            if (dx === 0) { nextDx = 1; nextDy = 0; e.preventDefault(); }
        }
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    document.addEventListener('keydown', handleKeyPress);

    // Initial draw
    draw();
})();

