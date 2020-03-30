var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2],
]

const wordList = ["Human","Alien", "Earthling", "Person", "Mortal", "Anthropoid", "Sapien", "Water Bender", "Thanos", "God of Thunder", "Dark Knight", "Iron Man", "Vigilance"]
var count = 0;

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	document.querySelector(".stuff").style.display = "block";
	var item = wordList[Math.floor(Math.random() * wordList.length)];
	document.querySelector(".stuff h1").innerText = item + " vs Minimax AI";

	origBoard = Array.from(Array(9).keys());
	//console.log(origBoard)
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) {
			turn(bestSpot(), aiPlayer);
			console.log(count);
			document.querySelector(".stuff h1").innerText = count + " Recursive Calls";

			count = 0;

		}
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.color =
		gameWon.player == huPlayer ? "blue" : "#ffdb59"; // blue will never going to happen 
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win" : "You lose");
}

function declareWinner(who) {
	if(who == "You lose"){
		//document.querySelector(".endgame").style.backgroundColor = "rgba(219, 219, 219, 0.7)"; // red

	} else if (who == "Tie") {
		//document.querySelector(".endgame").style.backgroundColor = "rgba(219, 219, 219, 0.7)"; // green
	}
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".stuff").style.display = "none";

	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			//cells[i].style.backgroundColor = "#dbdbdb"; //gray
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = availSpots[i];
		newBoard[availSpots[i]] = player;
		count++;
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}