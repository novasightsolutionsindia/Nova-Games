// Pacman Game Implementation

class PacmanGame {
    constructor() {
        this.canvas = document.getElementById('pacmanCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        
        // Game constants
        this.CELL_SIZE = 20;
        this.PACMAN_SPEED = 5;
        this.GHOST_SPEED = 4;
        
        // Maze layout (1 = wall, 0 = dot, 2 = power pellet, 3 = empty)
        this.maze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,2,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,2,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
            [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,1,1,1,3,3,1,1,1,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,1,3,3,3,3,3,3,1,0,1,1,0,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,0,1,1,0,1,3,3,3,3,3,3,1,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
            [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,2,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,1],
            [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
            [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
            [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        this.pacman = {
            x: 14,
            y: 23,
            direction: 'right',
            nextDirection: 'right',
            mouthOpen: 0,
            mouthSpeed: 0.2
        };
        
        this.ghosts = [
            { name: 'blinky', color: '#d63031', x: 14, y: 14, direction: 'left', mode: 'scatter' },
            { name: 'pinky', color: '#f39c12', x: 14, y: 17, direction: 'right', mode: 'scatter' },
            { name: 'inky', color: '#00d2d3', x: 13, y: 14, direction: 'up', mode: 'scatter' },
            { name: 'clyde', color: '#fdcb6e', x: 15, y: 14, direction: 'down', mode: 'scatter' }
        ];
        
        this.score = 0;
        this.lives = 3;
        this.dotsCount = 0;
        this.totalDots = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        // Count total dots
        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[0].length; col++) {
                if (this.maze[row][col] === 0) this.totalDots++;
            }
        }
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        this.draw();
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.key) {
            case 'ArrowUp':
                this.pacman.nextDirection = 'up';
                break;
            case 'ArrowDown':
                this.pacman.nextDirection = 'down';
                break;
            case 'ArrowLeft':
                this.pacman.nextDirection = 'left';
                break;
            case 'ArrowRight':
                this.pacman.nextDirection = 'right';
                break;
        }
    }
    
    canMove(x, y) {
        const row = Math.floor(y);
        const col = Math.floor(x);
        
        // Check boundaries
        if (row < 0 || row >= this.maze.length || col < 0 || col >= this.maze[0].length) {
            return false;
        }
        
        // Check walls (1)
        return this.maze[row][col] !== 1;
    }
    
    movePacman() {
        let newX = this.pacman.x;
        let newY = this.pacman.y;
        
        // Try next direction first
        if (this.pacman.nextDirection) {
            switch(this.pacman.nextDirection) {
                case 'right':
                    newX += this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'left':
                    newX -= this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'up':
                    newY -= this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'down':
                    newY += this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
            }
            
            if (this.canMove(newX, newY)) {
                this.pacman.direction = this.pacman.nextDirection;
                this.pacman.x = newX;
                this.pacman.y = newY;
            } else {
                // Try current direction
                newX = this.pacman.x;
                newY = this.pacman.y;
                
                switch(this.pacman.direction) {
                    case 'right':
                        newX += this.PACMAN_SPEED / this.CELL_SIZE;
                        break;
                    case 'left':
                        newX -= this.PACMAN_SPEED / this.CELL_SIZE;
                        break;
                    case 'up':
                        newY -= this.PACMAN_SPEED / this.CELL_SIZE;
                        break;
                    case 'down':
                        newY += this.PACMAN_SPEED / this.CELL_SIZE;
                        break;
                }
                
                if (this.canMove(newX, newY)) {
                    this.pacman.x = newX;
                    this.pacman.y = newY;
                }
            }
        } else {
            // Just move in current direction
            switch(this.pacman.direction) {
                case 'right':
                    newX += this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'left':
                    newX -= this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'up':
                    newY -= this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
                case 'down':
                    newY += this.PACMAN_SPEED / this.CELL_SIZE;
                    break;
            }
            
            if (this.canMove(newX, newY)) {
                this.pacman.x = newX;
                this.pacman.y = newY;
            }
        }
        
        // Wrap around tunnel
        if (this.pacman.x < 0) this.pacman.x = this.maze[0].length - 0.5;
        if (this.pacman.x > this.maze[0].length - 0.5) this.pacman.x = 0;
        
        // Update mouth animation
        this.pacman.mouthOpen += this.pacman.mouthSpeed;
        if (this.pacman.mouthOpen > 1) this.pacman.mouthOpen = 0;
    }
    
    checkDotCollision() {
        const row = Math.floor(this.pacman.y);
        const col = Math.floor(this.pacman.x);
        
        if (row >= 0 && row < this.maze.length && col >= 0 && col < this.maze[0].length) {
            if (this.maze[row][col] === 0) {
                this.score += 10;
                this.scoreElement.textContent = this.score;
                this.maze[row][col] = 3; // Empty
                this.dotsCount++;
                
                if (this.dotsCount === this.totalDots) {
                    this.win();
                }
            } else if (this.maze[row][col] === 2) {
                this.score += 50;
                this.scoreElement.textContent = this.score;
                this.maze[row][col] = 3; // Empty
                this.activatePowerMode();
            }
        }
    }
    
    activatePowerMode() {
        this.ghosts.forEach(ghost => {
            ghost.mode = 'frightened';
        });
        
        setTimeout(() => {
            this.ghosts.forEach(ghost => {
                ghost.mode = 'chase';
            });
        }, 8000);
    }
    
    moveGhosts() {
        this.ghosts.forEach(ghost => {
            // Simple AI - random movement for now
            if (Math.random() < 0.02) {
                const directions = ['up', 'down', 'left', 'right'];
                ghost.direction = directions[Math.floor(Math.random() * 4)];
            }
            
            let newX = ghost.x;
            let newY = ghost.y;
            
            switch(ghost.direction) {
                case 'right':
                    newX += this.GHOST_SPEED / this.CELL_SIZE;
                    break;
                case 'left':
                    newX -= this.GHOST_SPEED / this.CELL_SIZE;
                    break;
                case 'up':
                    newY -= this.GHOST_SPEED / this.CELL_SIZE;
                    break;
                case 'down':
                    newY += this.GHOST_SPEED / this.CELL_SIZE;
                    break;
            }
            
            if (this.canMove(newX, newY)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // Change direction
                const directions = ['up', 'down', 'left', 'right'];
                ghost.direction = directions[Math.floor(Math.random() * 4)];
            }
            
            // Wrap around tunnel
            if (ghost.x < 0) ghost.x = this.maze[0].length - 0.5;
            if (ghost.x > this.maze[0].length - 0.5) ghost.x = 0;
        });
    }
    
    checkGhostCollision() {
        const pacmanRow = Math.floor(this.pacman.y);
        const pacmanCol = Math.floor(this.pacman.x);
        
        for (let ghost of this.ghosts) {
            const ghostRow = Math.floor(ghost.y);
            const ghostCol = Math.floor(ghost.x);
            
            if (pacmanRow === ghostRow && pacmanCol === ghostCol) {
                if (ghost.mode === 'frightened') {
                    // Eat ghost
                    this.score += 200;
                    this.scoreElement.textContent = this.score;
                    ghost.x = 14;
                    ghost.y = 14;
                    ghost.mode = 'scatter';
                } else {
                    this.lives--;
                    this.livesElement.textContent = this.lives;
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        // Reset positions
                        this.pacman.x = 14;
                        this.pacman.y = 23;
                        this.ghosts.forEach(g => {
                            g.x = 14;
                            g.y = 14;
                        });
                    }
                }
            }
        }
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.movePacman();
        this.moveGhosts();
        this.checkDotCollision();
        this.checkGhostCollision();
        this.draw();
        
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[0].length; col++) {
                const x = col * this.CELL_SIZE;
                const y = row * this.CELL_SIZE;
                
                if (this.maze[row][col] === 1) {
                    // Draw wall
                    this.ctx.fillStyle = '#00f';
                    this.ctx.fillRect(x, y, this.CELL_SIZE - 1, this.CELL_SIZE - 1);
                    
                    // Add highlight
                    this.ctx.fillStyle = '#33f';
                    this.ctx.fillRect(x + 2, y + 2, this.CELL_SIZE - 5, this.CELL_SIZE - 5);
                } else if (this.maze[row][col] === 0) {
                    // Draw dot
                    this.ctx.fillStyle = '#fff';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        x + this.CELL_SIZE / 2,
                        y + this.CELL_SIZE / 2,
                        3,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                } else if (this.maze[row][col] === 2) {
                    // Draw power pellet
                    this.ctx.fillStyle = '#fff';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        x + this.CELL_SIZE / 2,
                        y + this.CELL_SIZE / 2,
                        8,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                }
            }
        }
        
        // Draw ghosts
        this.ghosts.forEach(ghost => {
            const x = ghost.x * this.CELL_SIZE;
            const y = ghost.y * this.CELL_SIZE;
            
            if (ghost.mode === 'frightened') {
                this.ctx.fillStyle = '#212121';
            } else {
                this.ctx.fillStyle = ghost.color;
            }
            
            // Draw ghost body
            this.ctx.beginPath();
            this.ctx.arc(x + this.CELL_SIZE / 2, y + this.CELL_SIZE / 2 - 2, this.CELL_SIZE / 2 - 2, 0, Math.PI, true);
            this.ctx.lineTo(x + 2, y + this.CELL_SIZE - 2);
            this.ctx.lineTo(x + this.CELL_SIZE - 2, y + this.CELL_SIZE - 2);
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw eyes
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(x + this.CELL_SIZE / 2 - 4, y + this.CELL_SIZE / 2 - 4, 3, 0, Math.PI * 2);
            this.ctx.arc(x + this.CELL_SIZE / 2 + 4, y + this.CELL_SIZE / 2 - 4, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(x + this.CELL_SIZE / 2 - 4, y + this.CELL_SIZE / 2 - 4, 1.5, 0, Math.PI * 2);
            this.ctx.arc(x + this.CELL_SIZE / 2 + 4, y + this.CELL_SIZE / 2 - 4, 1.5, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw Pacman
        const pacmanX = this.pacman.x * this.CELL_SIZE;
        const pacmanY = this.pacman.y * this.CELL_SIZE;
        
        this.ctx.fillStyle = '#f1c40f';
        
        let startAngle, endAngle;
        const mouthAngle = (Math.PI / 4) * this.pacman.mouthOpen;
        
        switch(this.pacman.direction) {
            case 'right':
                startAngle = mouthAngle;
                endAngle = 2 * Math.PI - mouthAngle;
                break;
            case 'left':
                startAngle = Math.PI + mouthAngle;
                endAngle = Math.PI - mouthAngle;
                break;
            case 'up':
                startAngle = Math.PI / 2 + mouthAngle;
                endAngle = Math.PI / 2 - mouthAngle;
                break;
            case 'down':
                startAngle = 3 * Math.PI / 2 + mouthAngle;
                endAngle = 3 * Math.PI / 2 - mouthAngle;
                break;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(
            pacmanX + this.CELL_SIZE / 2,
            pacmanY + this.CELL_SIZE / 2,
            this.CELL_SIZE / 2 - 2,
            startAngle,
            endAngle
        );
        this.ctx.lineTo(pacmanX + this.CELL_SIZE / 2, pacmanY + this.CELL_SIZE / 2);
        this.ctx.fill();
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
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Reload page for simplicity
        location.reload();
    }
    
    gameOver() {
        this.gameRunning = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>Your score: ${this.score}</p>
                <div class="modal-buttons">
                    <button class="modal-btn" onclick="location.reload()">Play Again</button>
                    <button class="modal-btn secondary" onclick="this.closest('.game-over-modal').remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    win() {
        this.gameRunning = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>You Win!</h2>
                <p>Congratulations! Your score: ${this.score}</p>
                <div class="modal-buttons">
                    <button class="modal-btn" onclick="location.reload()">Play Again</button>
                    <button class="modal-btn secondary" onclick="this.closest('.game-over-modal').remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new PacmanGame();
});