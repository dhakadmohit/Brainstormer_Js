var playerName = "";
var score = 0;
var bestScore = 0;
var time = 15;
var tempScore = 0;
var sign = "";
var gameInterval, timerInterval;

var nameInput = document.querySelector("#firstName");
var startButton = document.querySelector("#start");
var replayButton = document.querySelector("#replay");
var finalScoreDisplay = document.querySelector("#Scoree");

var cir1 = document.querySelector(".cir-1");
var cir2 = document.querySelector(".cir-2");
var cir3 = document.querySelector(".cir-3");
var cir4 = document.querySelector(".cir-4");

var circles = [cir1, cir2, cir3, cir4];
var arr = ["+", "-", "*", "/"];

const navHeight = 100;
const circleSize = 150;

// Timer Function
function timer() {
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(function () {
        document.querySelector("#timer").innerHTML = `Timer: ${time}`;
        time--;

        if (time < 0) {
            clearInterval(timerInterval);
            gameOver(); // Call game over function
        }
    }, 1000);
}

// Function to handle game over
function gameOver() {
    clearInterval(gameInterval); // Stop moving circles
    document.querySelector(".main-page").style.display = "none"; // Hide game screen
    document.querySelector(".final-score").style.display = "block"; // Show final score screen
    
    if (score > bestScore) {
        bestScore = score; // Update best score
    }

    finalScoreDisplay.innerHTML = `Final Score: ${score}<br> <br> Best Score: ${bestScore}`;
}

// Function to restart the game
function gameReplay() {
    tempScore = 0;
    score = 0;
    time = 15; // Reset time

    document.querySelector("#Score").innerHTML = `Score: ${score}`;
    document.querySelector("#timer").innerHTML = `Timer: ${time}`;

    document.querySelector(".main-page").style.display = "block"; // Show game screen
    document.querySelector(".final-score").style.display = "none"; // Hide final score screen

    timer(); // Restart the timer
    moveCircles(); // Position circles immediately

    clearInterval(gameInterval); // Clear any previous interval
    gameInterval = setInterval(moveCircles, 2000); // Restart moving circles
}

// Ensure the Replay button works properly
replayButton.addEventListener("click", gameReplay);

// Function to get a random position (below nav bar & within screen)
function getRandomPosition(existingPositions) {
    let maxWidth = window.innerWidth - circleSize;
    let maxHeight = window.innerHeight - navHeight - circleSize;

    let newPos;
    let attempts = 0;
    do {
        newPos = {
            top: Math.random() * maxHeight + navHeight,
            left: Math.random() * maxWidth
        };
        attempts++;
    } while (isOverlappingWithExisting(newPos, existingPositions) && attempts < 50);

    return newPos;
}

// Function to check if a new position overlaps with any existing circles
function isOverlappingWithExisting(newPos, existingPositions) {
    return existingPositions.some(pos => {
        let distance = Math.sqrt(
            Math.pow(pos.left - newPos.left, 2) + Math.pow(pos.top - newPos.top, 2)
        );
        return distance < circleSize;
    });
}

// Function to get random values & signs for circles
function getValueAndSign() {
    return circles.map(() => ({
        value: Math.floor(Math.random() * 10), // Random number from 0-9
        sign: arr[Math.floor(Math.random() * arr.length)] // Random operator
    }));
}

// Function to move circles without overlapping
function moveCircles() {
    var positions = [];
    var values = getValueAndSign(); // Generate new values & signs

    circles.forEach((circle, index) => {
        let newPos = getRandomPosition(positions);
        positions.push(newPos);

        circle.style.top = `${newPos.top}px`;
        circle.style.left = `${newPos.left}px`;

        // Update the numbers & signs inside the circles
        circle.querySelector("h1").innerText = `${values[index].sign} ${values[index].value}`;
    });
}

// Function to extract the operator and number
function getOriginal(text) {
    sign = text.charAt(0); 
    tempScore = parseInt(text.substring(1)); 

    if (sign == "*") score *= tempScore;
    else if (sign == "/") {
        if (tempScore !== 0) score /= tempScore; // Avoid division by zero
    }
    else if (sign == "-") score -= tempScore;
    else if (sign == "+") score += tempScore;

    score =Math.floor(score)
    document.querySelector("#Score").innerHTML = `Score: ${Math.floor(score)}`;
}

// Click event listener for circles
// Click event listener for circles
document.querySelector(".main-page").addEventListener("click", function (e) {
    if (e.target.classList.contains("cir-1") || 
        e.target.classList.contains("cir-2") || 
        e.target.classList.contains("cir-3") || 
        e.target.classList.contains("cir-4")) {
        
        let h1Element = e.target.querySelector("h1"); 
        if (h1Element) {
            getOriginal(h1Element.innerText);
            
            // Clear previous interval & restart
            clearInterval(gameInterval);
            moveCircles(); // Move circles immediately
            gameInterval = setInterval(moveCircles, 2000); // Restart interval
        }
    } else if (e.target.tagName === "H1") {
        getOriginal(e.target.innerText);
        
        // Clear previous interval & restart
        clearInterval(gameInterval);
        moveCircles(); // Move circles immediately
        gameInterval = setInterval(moveCircles, 2000); // Restart interval
    }
});

// Start Button Click Event
startButton.addEventListener("click", function () {
    console.log("hek");
    
    playerName = nameInput.value;
    nameInput.value = "";
    document.querySelector(".main-page").style.display = "block";
    document.querySelector(".credentials").style.display = "none";
    document.querySelector("nav h2").innerText = `Name : ${playerName}`;
    
    // Start the timer
    timer();

    moveCircles(); // Position circles initially
    clearInterval(gameInterval); // Clear any old interval
    gameInterval = setInterval(moveCircles, 2000);
});
