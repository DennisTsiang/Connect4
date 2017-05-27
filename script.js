var COLUMNS = 7;
var ROWS = 6;
var playerTurn = "player1";

window.onload = function() {
	console.log("Window loaded");
	makeBoard(COLUMNS,ROWS);
	
}

function makeBoard(cols, rows) {
	createArrows(cols);
	createRows(cols, rows);
}

function createArrows(cols) {
	var table = document.getElementById("board");
	var header = table.createTHead();
	var row = header.insertRow(0);
	for (var i=0; i < cols; i++) {
		row.insertCell(i).innerHTML = '<button class="columnSelector" type="button" onclick="selectColumn(this.parentElement.cellIndex)"><div class="arrow-down"></div></button>';
	}
}

function createRows(cols, rows) {
	var table = document.getElementById("board").getElementsByTagName('tbody')[0];
	for(var i=0; i < rows; i++) {
		var row = table.insertRow(i);
		for(var j=0; j < cols; j++) {
			row.insertCell(j).innerHTML = '<div class="slot"></div>';
		}
	}
}

function playGame() {
	playerTurn = "player1";
	while(true) {
		selectColumn(playerTurn);
		if (victory()) {
			displayerWinner();
			break;
		}

	}
}

function selectColumn(col) {
	if(dropSuccessful(col)) {
		changePlayer();
	}
}

function changePlayer() {
	if (playerTurn == "player1") {
		playerTurn = "player2";
	} else {
		playerTurn = "player1";
	}
}

function getPlayerColour() {
	if (playerTurn == "player1") {
		return "red";
	} else {
		return "#FFEF00";
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
			return true;
		}
	}
	return false;
}

function getHexColour( color ){
    //if color is already in hex, just return it...
    if( color.indexOf('#') != -1 ) return color;

    //leave only "R,G,B" :
    color = color
                .replace("rgba", "") //must go BEFORE rgb replace
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