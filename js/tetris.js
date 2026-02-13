// Tetris Game Implementation

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.scoreElement = document.getElementById('score');
        this.linesElement = document.getElementById('lines');
        this.levelElement = document.getElementById('level');
        
        // Game constants
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 30;
        this.NEXT_BLOCK_SIZE = 20;
        
        // Tetromino shapes
        this.PIECES = [
            // I
            {
                shape: [[1, 1, 1, 1]],
                color: '#00d2d3'
            },
            // O
            {
                shape: [[1, 1], [1, 1]],
                color: '#fdcb6e'
            },
            // T
            {
                shape: [[0, 1, 0], [1, 1, 1]],
                color: '#a363d9'
            },
            // S
            {
                shape: [[0, 1, 1], [1, 1, 0]],
                color: '#00b894'
            },
            // Z
            {
                shape: [[1, 1, 0], [0, 1, 1]],
                color: '#d63031'
            },
            // J
            {
                shape: [[1, 0, 0], [1, 1, 1]],
                color: '#0984e3'
            },
            // L
            {
                shape: [[0, 0, 1], [1, 1, 1]],
                color: '#f39c12'
            }
        ];
        
        this.board = [];
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 500;
        this.dropInterval = null;
        
        this.init();
    }
    
    init() {
        // Initialize board
        for (let row = 0; row < this.ROWS; row++) {
            this.board[row] = new Array(this.COLS).fill(0);
        }
        
        // Generate first pieces
        this.nextPiece = this.getRandomPiece();
        this.spawnNewPiece();
        
        // Draw initial state
        this.draw();
        this.drawNext();
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    getRandomPiece() {
        const piece = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];
        return {
            shape: piece.shape.map(row => [...row]),
            color: piece.color,
            x: Math.floor((this.COLS - piece.shape[0].length) / 2),
            y: 0
        };
    }
    
    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.getRandomPiece();
        
        // Check game over
        if (this.checkCollision(this.currentPiece)) {
            this.gameOver();
        }
    }
    
    checkCollision(piece, offsetX = 0, offsetY = 0) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[0].length; col++) {
                if (piece.shape[row][col]) {
                    const newX = piece.x + col + offsetX;
                    const newY = piece.y + row + offsetY;
                    
                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS || newY < 0) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    mergePiece() {
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[0].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const y = this.currentPiece.y + row;
                    const x = this.currentPiece.x + col;
                    
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnNewPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.ROWS - 1; row >= 0; ) {
            if (this.board[row].every(cell => cell !== 0)) {
                // Remove line
                for (let r = row; r > 0; r--) {
                    this.board[r] = [...this.board[r - 1]];
                }
                this.board[0] = new Array(this.COLS).fill(0);
                linesCleared++;
            } else {
                row--;
            }
        }
        
        if (linesCleared > 0) {
            this.updateScore(linesCleared);
            this.lines += linesCleared;
            this.linesElement.textContent = this.lines;
            
            // Update level every 10 lines
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.levelElement.textContent = this.level;
                this.gameSpeed = Math.max(100, 500 - (this.level - 1) * 40);
                this.updateDropInterval();
            }
        }
    }
    
    updateScore(linesCleared) {
        const points = [0, 100, 300, 500, 800];
        this.score += points[linesCleared] * this.level;
        this.scoreElement.textContent = this.score;
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece || this.gamePaused) return false;
        
        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.draw();
            return true;
        } else if (dy > 0) {
            // Hit bottom, merge piece
            this.mergePiece();
            this.draw();
        }
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece || this.gamePaused) return;
        
        const rotated = {
            shape: this.currentPiece.shape[0].map((_, i) =>
                this.currentPiece.shape.map(row => row[i]).reverse()
            ),
            color: this.currentPiece.color,
            x: this.currentPiece.x,
            y: this.currentPiece.y
        };
        
        if (!this.checkCollision(rotated)) {
            this.currentPiece.shape = rotated.shape;
            this.draw();
        }
    }
    
    dropPiece() {
        if (!this.currentPiece || this.gamePaused) return;
        
        while (!this.checkCollision(this.currentPiece, 0, 1)) {
            this.currentPiece.y++;
        }
        this.mergePiece();
        this.draw();
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                this.movePiece(0, 1);
                break;
            case 'ArrowUp':
                this.rotatePiece();
                break;
            case ' ':
                e.preventDefault();
                this.dropPiece();
                break;
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1e272e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#34495e';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.COLS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.BLOCK_SIZE, 0);
            this.ctx.lineTo(i * this.BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.ROWS; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.BLOCK_SIZE);
            this.ctx.lineTo(this.canvas.width, i * this.BLOCK_SIZE);
            this.ctx.stroke();
        }
        
        // Draw board
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.board[row][col]) {
                    this.ctx.fillStyle = this.board[row][col];
                    this.ctx.fillRect(
                        col * this.BLOCK_SIZE + 1,
                        row * this.BLOCK_SIZE + 1,
                        this.BLOCK_SIZE - 2,
                        this.BLOCK_SIZE - 2
                    );
                    
                    // Add highlight
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(
                        col * this.BLOCK_SIZE + 1,
                        row * this.BLOCK_SIZE + 1,
                        this.BLOCK_SIZE - 2,
                        3
                    );
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[0].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        this.ctx.fillStyle = this.currentPiece.color;
                        this.ctx.fillRect(
                            (this.currentPiece.x + col) * this.BLOCK_SIZE + 1,
                            (this.currentPiece.y + row) * this.BLOCK_SIZE + 1,
                            this.BLOCK_SIZE - 2,
                            this.BLOCK_SIZE - 2
                        );
                        
                        // Add highlight
                        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        this.ctx.fillRect(
                            (this.currentPiece.x + col) * this.BLOCK_SIZE + 1,
                            (this.currentPiece.y + row) * this.BLOCK_SIZE + 1,
                            this.BLOCK_SIZE - 2,
                            3
                        );
                    }
                }
            }
        }
    }
    
    drawNext() {
        this.nextCtx.fillStyle = '#1e272e';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const piece = this.nextPiece;
            const offsetX = (this.nextCanvas.width - piece.shape[0].length * this.NEXT_BLOCK_SIZE) / 2;
            const offsetY = (this.nextCanvas.height - piece.shape.length * this.NEXT_BLOCK_SIZE) / 2;
            
            for (let row = 0; row < piece.shape.length; row++) {
                for (let col = 0; col < piece.shape[0].length; col++) {
                    if (piece.shape[row][col]) {
                        this.nextCtx.fillStyle = piece.color;
                        this.nextCtx.fillRect(
                            offsetX + col * this.NEXT_BLOCK_SIZE,
                            offsetY + row * this.NEXT_BLOCK_SIZE,
                            this.NEXT_BLOCK_SIZE - 2,
                            this.NEXT_BLOCK_SIZE - 2
                        );
                    }
                }
            }
        }
    }
    
    gameLoop() {
        if (this.gameRunning && !this.gamePaused) {
            this.movePiece(0, 1);
            this.drawNext();
        }
    }
    
    updateDropInterval() {
        if (this.dropInterval) {
            clearInterval(this.dropInterval);
        }
        this.dropInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    }
    
    start() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.updateDropInterval();
        } else if (this.gamePaused) {
            this.gamePaused = false;
        }
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    reset() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        if (this.dropInterval) {
            clearInterval(this.dropInterval);
        }
        
        // Reset board
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.board[row][col] = 0;
            }
        }
        
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameSpeed = 500;
        
        this.scoreElement.textContent = this.score;
        this.linesElement.textContent = this.lines;
        this.levelElement.textContent = this.level;
        
        this.nextPiece = this.getRandomPiece();
        this.spawnNewPiece();
        
        this.draw();
        this.drawNext();
    }
    
    gameOver() {
        this.gameRunning = false;
        
        if (this.dropInterval) {
            clearInterval(this.dropInterval);
        }
        
        this.showGameOverModal();
    }
    
    showGameOverModal() {
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Game Over!</h2>
                <p>Score: ${this.score}</p>
                <p>Lines: ${this.lines}</p>
                <p>Level: ${this.level}</p>
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
    new TetrisGame();
});