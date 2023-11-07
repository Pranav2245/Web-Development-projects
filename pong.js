const collisionSound = new Audio("assets/move.mp3");
const TouchSound = new Audio("assets/balltouch.mp3");
const MissSound = new Audio("assets/miss.mp3");

let board;


let boardWidth = 500;
let boardHeight = 500;
let context; 
let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0; 

let p1Name = ""; 
let p2Name = "";

let player1 = {  
    x : 10,
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let player2 = {
    x : boardWidth - playerWidth - 10, 
    y : boardHeight/2,
    width: playerWidth,
    height: playerHeight,
    velocityY : 0
}

let isGamePaused = false;
let ballWidth = 10;
let ballHeight = 10;


let ball = {
    x: boardWidth / 2, 
    y: boardHeight / 2, 

    velocityX: 1,
    velocityY: 2
};

let player1Score = 0;
let player2Score = 0;


window.onload = function() {
    if (!p1Name && !p2Name) { 
        p1Name = prompt("Enter name of first player:", "Player1");
        p2Name = prompt("Enter name of second player:", "Player2");
        p1.innerHTML = "Challenger 1 ~ <strong>" + p1Name + "</strong>";
        p2.innerHTML = "Challenger 2 ~ <strong>" + p2Name + "</strong>";
    }

    if (p1Name && p2Name) {
        document.getElementsByClassName("button-container")[0].style.display = "block"; 
        document.getElementById("startButton").addEventListener("click", startGame);
    }

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 
     context.fillStyle="white";  
     context.fillRect(player1.x, player1.y, playerWidth, playerHeight); 
     context.fillRect(player2.x, player2.y, playerWidth, playerHeight); 
     document.addEventListener("keyup", movePlayer);
}

function startGame(){
    requestAnimationFrame(update);
}

document.getElementById("pauseButton").addEventListener("click", pauseGame);
function pauseGame() {
    if (isGamePaused) {
        resume();
    } else {
        pause();
    }
}

function pause() {
    isGamePaused = true;
    document.getElementById("pauseButton").textContent = "Resume";
    cancelAnimationFrame(update);
}

function resume() {
    isGamePaused = false;
    document.getElementById("pauseButton").textContent = "Pause";
    update(); 
}
document.getElementById("restartButton").addEventListener("click", restartGame);
function restartGame() {
    player1Score = 0;
    player2Score = 0;
    player1.y = boardHeight / 2;
    player2.y = boardHeight / 2;
    resetGame(1); 
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = "";
    resultMessage.style.display = "none";

    update(); 
}
document.getElementById("endButton").addEventListener("click", endGame);
function endGame() {
    let winner;
    if (player1Score > player2Score) {
        winner = p1Name;
    } else if (player2Score > player1Score) {
        winner = p2Name;
    } else {
        winner = "Draw";
    }
    pause();
    resetGame(1);
    let resultMessage = document.getElementById("resultMessage");
    resultMessage.textContent = `Result: ${winner}`;
    resultMessage.style.display = "block"; 
}


function update(){
    if(!isGamePaused)
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);
    
    context.fillStyle="white";  

    let nextPlayer1Y = player1.y + player1.velocityY;
    if (!outOfBounds(nextPlayer1Y)) {
        player1.y = nextPlayer1Y;
    }
    context.fillRect(player1.x, player1.y, playerWidth, playerHeight);
    let nextPlayer2Y = player2.y + player2.velocityY;
    if (!outOfBounds(nextPlayer2Y)) {
        player2.y = nextPlayer2Y;
    }
   
    context.fillRect(player2.x, player2.y, playerWidth, playerHeight);
     context.beginPath();
    context.fillStyle = "white";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ballWidth, ballHeight);

     if (ball.y <= 0 || (ball.y + ballHeight >= boardHeight)) { 
        collisionSound.play();
        ball.velocityY *= -1; 
    }
        if (detectCollision(ball, player1)) {
            if (ball.x <= player1.x + player1.width) {
                TouchSound.play();
                ball.velocityX *= -1; 
            }
        }
        else if (detectCollision(ball, player2)) {
            if (ball.x + ballWidth >= player2.x) { 
                TouchSound.play();
                ball.velocityX *= -1;
            }
        } 
        if (ball.x < 0) { 
            MissSound.play();
            player2Score++;
            resetGame(1);
          }
        else if (ball.x + ballWidth > boardWidth) {   
            MissSound.play();
            player1Score++;
            resetGame(-1);
    }

    -
    context.font = "45px sans-serif";
    context.fillText(player1Score, boardWidth/5, 45);  
    context.fillText(player2Score, boardWidth*4/5 - 45, 45);  


   
    for (let i = 10; i < board.height; i += 25) { 
        context.fillRect(board.width / 2 - 10, i, 5, 5);   
    }
}


function outOfBounds(yPosition) {  
    return (yPosition < 0 || yPosition + playerHeight > boardHeight);
}


function movePlayer(e) {
    


    if (e.code == "KeyW") {  
        player1.velocityY = -3;
    }

    else if (e.code == "KeyS") {
        player1.velocityY = 3;
    }

     
     if (e.code == "ArrowUp") {
        player2.velocityY = -3;
    }
    else if (e.code == "ArrowDown") {
        player2.velocityY = 3;
    }
}


function detectCollision(a, b) { 
    return a.x < b.x + b.width &&  
           a.x + a.width > b.x &&  
           a.y < b.y + b.height && 
           a.y + a.height > b.y;    
}

function resetGame(direction) {  
    ball = {  
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : direction,
        velocityY : 2
    }
}