// Snake Game Implementation

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [];
        this.direction = { x: 0, y: 0 };
        this.food = {};
        this.score = 0;
        this.highScore = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 100;
        
        this.init();
    }
    
    init() {
        // Load high score
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.highScoreElement.textContent = this.highScore;
        
        // Initialize snake
        this.snake = [
            { x: 10, y: 10 }
        ];
        
        // Generate first food
        this.generateFood();
        
        // Draw initial state
        this.draw();
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const key = e.key;
        
        // Prevent snake from going back into itself
        if (key === 'ArrowUp' && this.direction.y === 0) {
            this.direction = { x: 0, y: -1 };
        } else if (key === 'ArrowDown' && this.direction.y === 0) {
            this.direction = { x: 0, y: 1 };
        } else if (key === 'ArrowLeft' && this.direction.x === 0) {
            this.direction = { x: -1, y: 0 };
        } else if (key === 'ArrowRight' && this.direction.x === 0) {
            this.direction = { x: 1, y: 0 };
        }
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // Move snake head
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.generateFood();
            
            // Increase speed slightly every 50 points
            if (this.score % 50 === 0 && this.gameSpeed > 50) {
                this.gameSpeed -= 5;
                this.updateGameLoop();
            }
        } else {
            // Remove tail
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1e272e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#00d2d3';
            } else {
                // Body
                const gradient = this.ctx.createLinearGradient(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    (segment.x + 1) * this.gridSize,
                    (segment.y + 1) * this.gridSize
                );
                gradient.addColorStop(0, '#6c5ce7');
                gradient.addColorStop(1, '#a363d9');
                this.ctx.fillStyle = gradient;
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 2,
                segment.y * this.gridSize + 2,
                this.gridSize - 4,
                this.gridSize - 4
            );
            
            // Add eyes to head
            if (index === 0) {
                this.ctx.fillStyle = '#ffffff';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                if (this.direction.x === 1) { // Right
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Left
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                } else if (this.direction.y === -1) { // Up
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                } else if (this.direction.y === 1) { // Down
                    this.ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                }
            }
        });
        
        // Draw food
        this.ctx.fillStyle = '#d63031';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 4,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Add shine to food
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2 - 2,
            this.food.y * this.gridSize + this.gridSize / 2 - 2,
            2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    gameLoop() {
        this.update();
        this.draw();
        
        if (this.gameRunning) {
            setTimeout(() => this.gameLoop(), this.gameSpeed);
        }
    }
    
    updateGameLoop() {
        if (this.gameRunning) {
            this.gameRunning = false;
            this.gameRunning = true;
            this.gameLoop();
        }
    }
    
    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameLoop();
        } else if (this.gamePaused) {
            this.gamePaused = false;
            this.gameLoop();
        }
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    reset() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.gameSpeed = 100;
        this.generateFood();
        this.draw();
    }
    
    gameOver() {
        this.gameRunning = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        // Show game over message
        this.showGameOverModal();
    }
    
    showGameOverModal() {
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>Your score: ${this.score}</p>
                <p>High score: ${this.highScore}</p>
                <div class="modal-buttons">
                    <button class="modal-btn" onclick="location.reload()">Play Again</button>
                    <button class="modal-btn secondary" onclick="this.closest('.game-over-modal').remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});