// Memory Card Game Implementation

class MemoryGame {
    constructor() {
        this.board = document.getElementById('memoryBoard');
        this.movesElement = document.getElementById('moves');
        this.matchesElement = document.getElementById('matches');
        this.timeElement = document.getElementById('time');
        
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timer = null;
        this.seconds = 0;
        this.gameStarted = false;
        this.canFlip = true;
        
        // Card symbols (emojis for simplicity)
        this.symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        
        this.init();
    }
    
    init() {
        // Reset game state
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.seconds = 0;
        this.gameStarted = false;
        this.canFlip = true;
        
        // Update displays
        this.movesElement.textContent = this.moves;
        this.matchesElement.textContent = `0/${this.symbols.length}`;
        this.timeElement.textContent = '00:00';
        
        // Create card pairs
        const cardPairs = [];
        this.symbols.forEach((symbol, index) => {
            cardPairs.push({ id: index * 2, symbol, matched: false, flipped: false });
            cardPairs.push({ id: index * 2 + 1, symbol, matched: false, flipped: false });
        });
        
        // Shuffle cards
        this.cards = this.shuffleArray(cardPairs);
        
        // Render board
        this.renderBoard();
        
        // Event listeners
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = `memory-card ${card.matched ? 'matched' : ''} ${card.flipped ? 'flipped' : ''}`;
            cardElement.dataset.index = index;
            
            if (card.matched) {
                cardElement.textContent = card.symbol;
                cardElement.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            } else if (card.flipped) {
                cardElement.textContent = card.symbol;
            } else {
                cardElement.textContent = '?';
            }
            
            cardElement.addEventListener('click', () => this.handleCardClick(index));
            this.board.appendChild(cardElement);
        });
    }
    
    handleCardClick(index) {
        if (!this.gameStarted || !this.canFlip) return;
        
        const card = this.cards[index];
        
        // Prevent clicking matched cards or already flipped cards
        if (card.matched || card.flipped) return;
        
        // Prevent flipping more than 2 cards
        if (this.flippedCards.length >= 2) return;
        
        // Flip card
        card.flipped = true;
        this.flippedCards.push({ index, card });
        this.renderBoard();
        
        // Check for match when 2 cards are flipped
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.movesElement.textContent = this.moves;
            
            this.checkMatch();
        }
    }
    
    checkMatch() {
        this.canFlip = false;
        
        const [first, second] = this.flippedCards;
        const isMatch = first.card.symbol === second.card.symbol;
        
        if (isMatch) {
            // Match found
            setTimeout(() => {
                first.card.matched = true;
                second.card.matched = true;
                first.card.flipped = true;
                second.card.flipped = true;
                
                this.matchedPairs++;
                this.matchesElement.textContent = `${this.matchedPairs}/${this.symbols.length}`;
                
                this.flippedCards = [];
                this.canFlip = true;
                this.renderBoard();
                
                // Check for win
                if (this.matchedPairs === this.symbols.length) {
                    this.win();
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                first.card.flipped = false;
                second.card.flipped = false;
                
                this.flippedCards = [];
                this.canFlip = true;
                this.renderBoard();
            }, 1000);
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.seconds++;
            const minutes = Math.floor(this.seconds / 60);
            const remainingSeconds = this.seconds % 60;
            this.timeElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    start() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTimer();
        }
    }
    
    reset() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.init();
    }
    
    win() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.gameStarted = false;
        this.canFlip = false;
        
        // Show win message
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 Congratulations! 🎉</h2>
                <p>You completed the game in:</p>
                <p>Moves: ${this.moves}</p>
                <p>Time: ${this.timeElement.textContent}</p>
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
    new MemoryGame();
});