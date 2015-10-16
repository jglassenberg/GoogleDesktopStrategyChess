/****************************************************************8
		Soldier class handling
*******************************************************************/

/*
This is the soldier object, the basic unit for each player's set of 40 units
*/
function soldier(num){
	this.isAlive = 1; //Determines if the unit is still alive and in the game
	this.isKnown = 0; //if the user has not attacked an enemy unit, the opponent cannot know who this unit is
	this.hasMoved = 0; //becomes 1 once a unit has moved.  Used for AI to watch for mines
	this.justMoved = false;
	this.value = num; //This determines the type of unit-general, mine, spy, etc.
	this.x = -1; //Current location on the board.
	this.y = -1;
	//TODO: add image based on num here

	//This is a function to set the location of a unit
	this.setSoldierLocation = setSoldierLocation;
	this.soldierDie = soldierDie;
	this.getThisSoldierRank = getThisSoldierRank;
	this.rest = SoldierReset;
};

/*
Set the location on the board for a particular soldier
*/
function setSoldierLocation(x,y){
	this.x = x;
	this.y = y;
};

/*
soldier declares itself dead, mostly so AI knows not to use it.
*/
function soldierDie(){
	this.isAlive = 0;
};

function SoldierReset(){
	this.isAlive = 1;
	this. isKnown = 0;
	this.hasMoved = 0;
	this.justMoved = false;
};

/*
Returns the rank of this soldier, based on its ID
*/
function getThisSoldierRank(){
	if (this.value == 0) return 0; //spy
	if (this.value == 1) return 1; //general, 1
	if (this.value == 2) return 2; //2
	if ((this.value > 2)&&(this.value < 5)) return 3; //3
	if ((this.value > 4)&&(this.value < 8)) return 4; //4
	if ((this.value > 7)&&(this.value < 12)) return 5; //5
	if ((this.value > 11)&&(this.value < 16)) return 6; //6
	if ((this.value > 15)&&(this.value < 20)) return 7; //7
	if ((this.value > 19)&&(this.value < 25)) return 8; //8
	if ((this.value > 24)&&(this.value < 33)) return 9; //9
	if ((this.value > 32)&&(this.value < 39)) return 10; //mine
	if (this.value == 39) return 11; //Flag	
};

/*
Returns the rank of this soldier, based on its ID
*/
function getSoldierRank(value){
	if (value == 0) return 0; //spy
	if (value == 1) return 1; //general, 1
	if (value == 2) return 2; //2
	if ((value > 2)&&(value < 5)) return 3; //3
	if ((value > 4)&&(value < 8)) return 4; //4
	if ((value > 7)&&(value < 12)) return 5; //5
	if ((value > 11)&&(value < 16)) return 6; //6
	if ((value > 15)&&(value < 20)) return 7; //7
	if ((value > 19)&&(value < 25)) return 8; //8
	if ((value > 24)&&(value < 33)) return 9; //9
	if ((value > 32)&&(value < 39)) return 10; //mine
	if (value == 39) return 11; //Flag	
};

/*
A unit on a board is set to die, lost an attack
*/
function killSoldier(num, x, y){
	if (num > 0){ //This is the human player's piece
		Units[0][num-1].soldierDie();
	}
	else{
		Units[1][-1-num].soldierDie();
	}
	
	board[x][y] = 0;
};

function getBoard(){
	return board;
};

/**********************************************************
			Solider movement code (Turns)
**********************************************************/

/*
Move a unit from one location to another
*/
function moveSoldier(x1,y1,x2,y2){
	var unit = board[x1][y1];
	setHasMoved(unit); //the AI now knows that this unit has moved
	if (board[x2][y2] == 0){ //if moving onto a safe spot
		//alert("safe spot");
		board[x2][y2] = board[x1][y1];
		board[x1][y1] = 0;
		setUnitPosition(unit, x2, y2);
		return 0;
	}
	else{
		return fight(unit,x1, y1, board[x2][y2], x2, y2);
	}
};

/*
Not used anymore
was for user to decide movement with only text boxes
*/
/*function tempMove(num, direction){
	if(direction =="u") moveSoldier(Units[0][num-1].x, Units[0][num-1].y,Units[0][num-1].x,Units[0][num-1].y+1);
	else if(direction =="r") moveSoldier(Units[0][num-1].x, Units[0][num-1].y,Units[0][num-1].x+1,Units[0][num-1].y);
	else if(direction =="l") moveSoldier(Units[0][num-1].x, Units[0][num-1].y,Units[0][num-1].x-1,Units[0][num-1].y);
	else moveSoldier(Units[0][num-1].x, Units[0][num-1].y,Units[0][num-1].x,Units[0][num-1].y-1);
}
*/

/*
sets a new location for a soldier, based only on the board record
*/
function setUnitPosition(unit, x2, y2){
	if (unit > 0){
		Units[0][unit-1].x=x2;
		Units[0][unit-1].y=y2;
	}
	else {
		Units[1][-1-unit].x=x2;
		Units[1][-1-unit].y=y2;
	}
};

/*
determines the result of fights between 2 units
unit1 is the attacker, unit2 is the defender
*/
function fight(unit1, x1, y1, unit2, x2,y2){
	setVisible(unit1);
	setVisible(unit2);
	AddLog(unit1, unit2);
	var win = decideWinner(getBoardUnit(unit1), getBoardUnit(unit2));
	if (win==0){ //kill both soldiers
		killSoldier(unit1,x1, y1);
		killSoldier(unit2, x2, y2);
		return -1; //means both are dead
	}
	else if (win==-1){ //unit2 was killed
		killSoldier(unit2,x2,y2);
		moveSoldier(x1,y1, x2, y2); //unit1 can now move into unit2's spot
		return 0; //means unit1 won
	}
	else if (win==1){ //unit1 was killed
		killSoldier(unit1,x1,y1);
		if (getSoldierRank(getBoardUnit(unit2))!=10){ //if defender is a mine, it does not move. otherwise, it moves
			moveSoldier(x2, y2, x1, y1);
			return 1;//means unit2 won
		}
			
		return 2; //special case for mines. means unit2 won, but should not be moved
	}
	else{
		//Todo: handle flag capture case
		setGameOver(1); //The game is over, no more turns
		if(isSinglePlay){
			if(unit1 > 0){
				//alert(strFlagCapture1);
				DisplayWarning(strFlagCapture1); //inform user through bottom label
				DisplayEndBoard();
			}
			else{
				//alert(strCompCapture);
				DisplayWarning(strCompCapture);
			}
		}
		else{
			try{
				//alert(strFlagCapture1);
				DisplayWarning(strFlagCapture1);
				googleTalk.SendTalkData(friend_user_id, msgWon);
			}
			catch (e) {
				//dunno what else to do here
				//alert(strDisconnectAtWin);
				DisplayWarning(strDisconnectAtWin);
			}
			//alert("called end board");
			DisplayEndBoard();
		}
		//alert("fight over");
		
		return 3;
	}
};

/*
Makes a unit visible, the opponent now knows who it is.
*/
function setVisible(unit){
	if (unit > 0){
		Units[0][unit-1].isKnown = 1;
		Units[0][unit-1].justMoved = true;
		//for AI. Unless this is a mine, this unit will either move after winning the fight, or die
		if (getSoldierRank(unit-1) != 10)
			Units[0][unit-1].hasMoved = 1; 
	}
	else {
		Units[1][-1-unit].isKnown = 1;
		Units[1][-1-unit].justMoved = true;
		//for AI. Unless this is a mine, this unit will either move after winning the fight, or die
		if (getSoldierRank(-unit-1) != 10)
			Units[1][-1-unit].hasMoved = 1;
	}
};

/*
The opponent now knows that the unit has moved, is not flag or mine (for AI)
*/
function setHasMoved(unit){
	if (unit > 0){
		Units[0][unit-1].hasMoved = 1;
	}
	else {
		Units[1][-1-unit].hasMoved = 1;
	}
}
