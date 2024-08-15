let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1; // 1 for Player 1, 2 for Player 2

const dice = document.querySelector('.dice');
const rollBtn = document.querySelector('.roll');
const holdBtn = document.querySelector('.hold');
const player1ScoreEl = document.getElementById('player-1-score');
const player2ScoreEl = document.getElementById('player-2-score');

const player1El = document.getElementById('player-1');
const player2El = document.getElementById('player-2');

const modal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const newGameBtn = document.getElementById('new-game-btn');

// Select audio elements from the DOM
const rollSound = document.getElementById('roll-sound');
const winSound = document.getElementById('win-sound');

const randomDice = () => {
    const random = Math.floor(Math.random() * 10);
    if (random >= 1 && random <= 6) {
        rollDice(random);
    } else {
        randomDice();
    }
}

const rollDice = (random) => {
    dice.style.animation = 'rolling 3s';

    // Play the rolling sound
    rollSound.play();

    setTimeout(() => {
        // Set the die face according to the rolled number
        switch (random) {
            case 1: dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
                break;
            case 6: dice.style.transform = 'rotateX(180deg) rotateY(0deg)';
                break;
            case 2: dice.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                break;
            case 5: dice.style.transform = 'rotateX(90deg) rotateY(0deg)';
                break;
            case 3: dice.style.transform = 'rotateX(0deg) rotateY(90deg)';
                break;
            case 4: dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                break;
            default: break;
        }
        dice.style.animation = 'none';

        // Stop the rolling sound after animation
        rollSound.pause();
        rollSound.currentTime = 0;

        // Get the corresponding fading text element after rolling ends
        const fadingTextEl = currentPlayer === 1 ? 
                             document.getElementById('fading-text-1') : 
                             document.getElementById('fading-text-2');

        let textColorClass = '';
        let scoreChange = 0;

        if (random === 1) {
            // If the roll is 1, subtract 5 points and make the text red
            textColorClass = 'red';
            scoreChange = -5;
        } else {
            // For any other roll, add the rolled number to the score
            textColorClass = 'green';
            scoreChange = random;
        }

        fadingTextEl.textContent = `${scoreChange > 0 ? '+' : ''}${scoreChange}`;
        fadingTextEl.classList.add('show-fading-text', textColorClass);

        // Update the score for the current player only
        if (currentPlayer === 1) {
            player1Score += scoreChange;
            player1ScoreEl.textContent = player1Score;
        } else {
            player2Score += scoreChange;
            player2ScoreEl.textContent = player2Score;
        }

        // Hide the fading text after it finishes fading
        setTimeout(() => {
            fadingTextEl.classList.remove('show-fading-text', 'red', 'green');
        }, 1000); // Adjust timing as needed

        // Check if there is a winner
        checkWinner();

        // Switch turns if the rolled number is 1
        if (random === 1) {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updatePlayerStyles(); // Update player styles after switching turns
        }

    }, 3050); // Adjusted to match the duration of the rolling animation
}

// Function to check if any player has won
const checkWinner = () => {
    if (player1Score >= 20) {
        showWinner(1);
    } else if (player2Score >= 20) {
        showWinner(2);
    }
}

// Function to display the winner modal and create particle effects
const showWinner = (player) => {
    winnerMessage.textContent = `PLAYER ${player} WINS!`;
    modal.style.display = 'block';

    // Play the win sound
    winSound.play();

    // Create particle effects when the modal appears
    createParticles();
}

const createParticles = () => {
    const particleCount = 100; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Randomize positions and directions for the particles
        particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        modal.appendChild(particle);

        // Remove particle after animation completes
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// Function to hide the modal
const hideModal = () => {
    modal.style.display = 'none';
}

// Function to reset the game
const resetGame = () => {
    player1Score = 0;
    player2Score = 0;
    player1ScoreEl.textContent = player1Score;
    player2ScoreEl.textContent = player2Score;
    hideModal(); // Hide the modal when resetting
    updatePlayerStyles(); // Ensure styles are updated when resetting
}

// Function to update player styles
const updatePlayerStyles = () => {
    if (currentPlayer === 1) {
        player1El.classList.add('active');
        player1El.classList.remove('inactive');
        player2El.classList.add('inactive');
        player2El.classList.remove('active');
    } else {
        player2El.classList.add('active');
        player2El.classList.remove('inactive');
        player1El.classList.add('inactive');
        player1El.classList.remove('active');
    }
}

// Initial style setup
updatePlayerStyles();

holdBtn.addEventListener('click', () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerStyles(); // Update player styles on hold
});

rollBtn.addEventListener('click', randomDice);

// Event listener for the new game button
newGameBtn.addEventListener('click', resetGame);

// Event listener to close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        hideModal();
    }
});
