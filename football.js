
var teams = ["Bengals", "Browns", "Steelers", "Ravens", "Patriots"];
var highscore = 0;
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var finalscore;
var curTile;
var swpTile;
var moves = 30;



window.onload = function() {
    startGame();
    window.setInterval(function(){
        match();
        if(moves === 30) {
            score = 0;
        }
        slideTile();
        dropTeam();
        checkGameOver();
    }, 100);
}

function randTeam() {
    return teams[Math.floor(Math.random()*teams.length)];
}

function startGame() {
    for(let i = 0; i<rows; i++) {
        let row = [];
        for(let j = 0; j<columns; j++) {
            let tile = document.createElement("img");
            tile.id = i.toString() + "-" + j.toString();
            tile.src = "./images/" + randTeam() + ".png";

            // drag teams
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("dragend", dragEnd);
            tile.addEventListener("drop", dragDrop);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function dragStart() {
    curTile = this;
}
function dragOver(a) {
    a.preventDefault();
}
function dragEnter(a) {
    a.preventDegault();
}
function dragLeave() {

}
function dragDrop() {
    swpTile = this;
}
function dragEnd() {
    let curLoc = curTile.id.split("-");
    let r = parseInt(curLoc[0]);
    let c = parseInt(curLoc[1]);
    let swpLoc = swpTile.id.split("-");
    let r2 = parseInt(swpLoc[0]);
    let c2 = parseInt(swpLoc[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;
    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdj = moveUp || moveRight || moveDown || moveLeft;

    
    let isSpecialSwap = curTile.src.includes("trophy") || swpTile.src.includes("trophy");


    if (isAdj) {
        let curImg = curTile.src;
        let swpImg = swpTile.src;

        curTile.src = swpImg;
        swpTile.src = curImg;

        if (!valid(isSpecialSwap)) {
            if (!isSpecialSwap) {
                curTile.src = curImg;
                swpTile.src = swpImg;
            }
        } else {
            moves -= 1;
            if(isSpecialSwap) {
                if(curTile.src.includes("trophy")) {
                    curTile.src = "./images/blank.png";
                    trophyMatch(swpTile.src);
                }else{
                    swpTile.src = "./images/blank.png";
                    trophyMatch(curTile.src);
                }
            }
        }
    }
}


function match() {
    matchTeam(5);
    matchTeam(4);
    matchTeam(3);
    document.getElementById("score").innerText = score;
    document.getElementById("moves").innerText = moves;
}

function matchTeam(amount) {
    for(let i = 0; i<rows; i++) {
        for(let j = 0; j<columns-(amount-1); j++) {
            let checkTeam = [];
            for(let k = 0; k<amount; k++) {
                checkTeam.push(board[i][j+k]);
            }
            if (checkTeam.every(team => team.src === checkTeam[0].src && !team.src.includes("blank"))) {
                checkTeam.forEach(team => team.src = "./images/blank.png");
                if(amount==5) {
                    checkTeam[2].src = "./images/trophy.png";
                }
                score += amount * 40; 
            }
        }
    }
    for(let i = 0; i<columns; i++) {
        for(let j = 0; j<rows-(amount-1); j++) {
            let checkTeam = [];
            for(let k = 0; k<amount; k++) {
                checkTeam.push(board[j+k][i]);
            }
            if (checkTeam.every(team => team.src === checkTeam[0].src && !team.src.includes("blank"))) {
                checkTeam.forEach(team => team.src = "./images/blank.png");
                if(amount==5) {
                    checkTeam[2].src = "./images/trophy.png";
                }
                score += amount * 40; 
            }
        }
    }
}

function valid(isChoco) {
    for(let i = 0; i<rows; i++) {
        for(let j = 0; j<columns-2; j++) {
            let t1 = board[i][j];
            let t2 = board[i][j+1];
            let t3 = board[i][j+2];
            if(t1.src == t2.src && t2.src == t3.src && !t1.src.includes("blank")) {
                return true;
            }
        }
    }
    for(let i = 0; i<columns; i++) {
        for(let j = 0; j<rows-2; j++) {
            let t1 = board[j][i]
            let t2 = board[j+1][i];
            let t3 = board[j+2][i];
            if(t1.src == t2.src && t2.src == t3.src && !t1.src.includes("blank")) {
                return true;
            }
        }
    }
    return isChoco;
}

function trophyMatch(team) {
    if(team.includes("trophy")){
        for(let i = 0; i<rows; i++) {
            for(let j = 0; j<columns; j++) {
                board[i][j].src = "./images/blank.png";
                score += 40;
            }
        }
    }
    else{
        for(let i = 0; i<rows; i++) {
            for(let j = 0; j<columns; j++) {
                if(board[i][j].src == team) {
                    board[i][j].src = "./images/blank.png";
                    score += 40;
                }
            }
        }
    }
}


function slideTile() {
    for(let i = 0; i<columns; i++) {
        let index = rows-1;
        for(let j = columns-1; j>=0; j--) {
            if(!board[j][i].src.includes("blank")) {
                board[index][i].src = board[j][i].src;
                index -= 1;
            }
        }

        for(let j = index; j>=0; j--) {
            board[j][i].src = "./images/blank.png";
        }
    }
}

function dropTeam() {
    for(let i = 0; i<columns; i++) {
        if(board[0][i].src.includes("blank")) {
            board[0][i].src = "./images/" + randTeam() + ".png";
        }
    }
}

function displayTopThree() {
    document.getElementById("score1").innerText = topScores[0] || 0; 
    document.getElementById("score2").innerText = topScores[1] || 0;
    document.getElementById("score3").innerText = topScores[2] || 0;
}

function checkGameOver() {
    if (moves === 0) {
        finalscore = score
        if(finalscore > highscore) {
            highscore = finalscore;
            document.getElementById("high-score").innerText = highscore;
        }
        document.getElementById("finalscore").innerText = finalscore;
        document.getElementById("overlay").style.display = "block";
        document.getElementById("end-popup").style.display = "block";
    }
}

function playAgain() {
    score = 0;
    moves = 30;
    board = [];
    document.getElementById("board").innerHTML = "";
    startGame();
    document.getElementById("overlay").style.display = "none";
    document.getElementById("end-popup").style.display = "none";
}

