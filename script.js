var COLUMNS = 7;
var ROWS = 6;
var player1 = "Player 1";
var player2 = "Player 2";
var playerTurn = player1;

window.onload = function() {
	console.log("Window loaded");
	makeBoard(COLUMNS,ROWS);
	updatePlayerOnScreen();
}

function makeBoard(cols, rows) {
	createArrows(cols);
	createRows(cols, rows);
}

function createArrows() {
	var table = document.getElementById("board");
	var header = table.createTHead();
	var row = header.insertRow(0);
	for (var i=0; i < COLUMNS; i++) {
		row.insertCell(i).innerHTML = '<button class="columnSelector" type="button" onclick="makeMove(this.parentElement.cellIndex)"><div class="arrow-down"></div></button>';
	}
}

function createRows() {
	var table = document.getElementById("board").getElementsByTagName('tbody')[0];
	for(var i=0; i < ROWS; i++) {
		var row = table.insertRow(i);
		for(var j=0; j < COLUMNS; j++) {
			row.insertCell(j).innerHTML = '<div class="slot"></div>';
		}
	}
}

function makeMove(col) {
	selectColumn(col);
	if (playerTurn == "Computer") {
		var computerCol = computerMove();
		selectColumn(computerCol);
	}
}

function selectColumn(col) {
	var row = dropSuccessful(col);
	if (row != -1) {
		if (!checkForVictory(row, col)) {
			changePlayer();
		}
	}
}

function changePlayer() {
	if (playerTurn == player1) {
		playerTurn = player2;
	} else {
		playerTurn = player1;
	}
	updatePlayerOnScreen();

}

function updatePlayerOnScreen() {
	document.getElementById('Player').innerHTML = playerTurn;
}

function getPlayerColour() {
	if (playerTurn == player1) {
		return "#ff0000";
	} else {
		return "#ffef00";
	}
}

function dropSuccessful(col) {
	var table = document.getElementById("board");
	for(var i=ROWS; i >= 1; i--) {
		var slot = table.rows[i].cells[col].children[0];
		var hexValue = getHexColour(window.getComputedStyle(slot, null).getPropertyValue('background-color'));
		if (hexValue == '#d3d3d3') {
			console.log('setting colour');
			slot.style.backgroundColor = getPlayerColour();
			return i;
		}
	}
	return -1;
}

function getHexColour( color ){
    //if color is already in hex, just return it...
    if( color.indexOf('#') != -1 ) return color;

    //leave only "R,G,B" :
    color = color
                .replace("rgba", "")
                .replace("rgb", "")
                .replace("(", "")
                .replace(")", "");
    color = color.split(","); // get Array["R","G","B"]

    // 0) add leading #
    // 1) add leading zero, so we get 0XY or 0X
    // 2) append leading zero with parsed out int value of R/G/B
    //    converted to HEX string representation
    // 3) slice out 2 last chars (get last 2 chars) => 
    //    => we get XY from 0XY and 0X stays the same
    return  "#"
            + ( '0' + parseInt(color[0], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[1], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[2], 10).toString(16) ).slice(-2);
}

function resetGame() {
	var table = document.getElementById("board");
	for(var i=0; i < ROWS+1; i++) {
		var row = table.deleteRow();
	}
	createArrows();
	createRows();
	playerTurn = player1;
	updatePlayerOnScreen();
	$('.overlay').show();
}

function checkForVictory(row, col) {
	if (horizontalWin(row, col) || diagonalWin() || verticalWin(row, col)) {
		disableButtons();
		displayWinner();
		return true;
	}
	return false;
}

function displayWinner() {
	var player = playerTurn;
	alert(player +" wins!");
}

function disableButtons() {
	var buttons = document.getElementsByClassName('columnSelector');
	for (var i=0; i < buttons.length; i++) {
		buttons[i].disabled = true;
	}
}

function horizontalWin(row, col) {
	var table = document.getElementById('board');
	var colour = getPlayerColour();
	var count = 0;
	for (var i=0; i < COLUMNS; i++) {
		var slot = table.rows[row].cells[i].children[0];
		var hexValue = getHexColour(window.getComputedStyle(slot, null).getPropertyValue('background-color'));
		if (hexValue == colour) {
			count++;
			if (count >=4) {
				return true;
			}
		} else {
			count = 0;
		}
	}
	return false;
	
}

function diagonalWin() {
	var count = 0;
	
	//Check down-right on upper triangle of board
	for (var col=COLUMNS-1; col >= 0; col--) {
		if (tallyDiagonalDownRight(1, col)) return true;
	}
	
	//Check down-right on lower triangle of board
	for (var row=ROWS; row >= 1; row--) {
		if(tallyDiagonalDownRight(row, 0)) return true;
	}
	
	//Check up-right on upper triangle of board
	for (var col=COLUMNS-1; col >= 0; col--) {
		if (tallyDiagonalUpRight(ROWS, col)) return true;
	}
	
	//Check up-right on lower triangle of board
	for (var row=1; row < ROWS; row++) {
		if(tallyDiagonalUpRight(row, 0)) return true;
	}
	
	return false;
}

function tallyDiagonalDownRight(startRow, startCol) {
	var current_row = startRow;
	var current_col = startCol;
	var table = document.getElementById('board');
	var colour = getPlayerColour();
	var count = 0;
	while (current_row <= ROWS && current_col < COLUMNS) {
		var slot = table.rows[current_row].cells[current_col].children[0];
		var hexValue = getHexColour(window.getComputedStyle(slot, null).getPropertyValue('background-color'));
		if (hexValue == colour) {
			count++;
			if (count >=4) {
				return true;
			}
		} else {
			count = 0;
		}
		current_row++;
		current_col++;
	}
	return false;
}

function tallyDiagonalUpRight(startRow, startCol) {
	var current_row = startRow;
	var current_col = startCol;
	var table = document.getElementById('board');
	var colour = getPlayerColour();
	var count = 0;
	while (current_row > 0 && current_col < COLUMNS) {
		var slot = table.rows[current_row].cells[current_col].children[0];
		var hexValue = getHexColour(window.getComputedStyle(slot, null).getPropertyValue('background-color'));
		if (hexValue == colour) {
			count++;
			if (count >=4) {
				return true;
			}
		} else {
			count = 0;
		}
		current_row--;
		current_col++;
	}
	return false;
}

function verticalWin(row, col) {
	var table = document.getElementById('board');
	var colour = getPlayerColour();
	var count = 0;
	for (var i=0; i < ROWS; i++) {
		var slot = table.rows[i+1].cells[col].children[0];
		var hexValue = getHexColour(window.getComputedStyle(slot, null).getPropertyValue('background-color'));
		if (hexValue == colour) {
			count++;
			if (count >=4) {
				return true;
			}
		} else {
			count = 0;
		}
	}
	return false;
}

//Computer makes a random move
function computerMove() {
	return Math.floor(Math.random() * COLUMNS)
}

function closeOverlay(id) {
	if (id == "Computer") {
		player2 = "Computer";
	} else {
		player2 = "Player 2";
	}
	$('.overlay').hide();
}