/******************************************************************
			Code for the AI
*******************************************************************/

/*
Here the computer decides what move to make
*/
function decideMove()
{
	var max = -20;
	var planList = new Array(33); //Stores the best option for each unit
	//determine the highest rank
	for (var i = 0; i < 33; i++){ 
		planList[i] = new movePlan(Units[1][i]);
		planList[i].getBestMove();
		if (max < planList[i].rank) {
			//if (planList[i].rank  == 100){ //flag captured, stop
			//	return;
			//}
			max = planList[i].rank;
		}
	}
	//Make sure there are still viable moves.  Otherwise, game is over
	if(max < 0){
		//TODO: add endgame here
		//alert(strCompSurrender);
		DisplayWarning(strCompSurrender); //just inform the user through the bottom label
		DisplayEndBoard();
		setGameOver(1); //The game is over, no more turns
		
		return;
	}
	//get all options of this ranking
	var bestOptions = new Array();
	for (i =0; i < 33; i++){
		if (planList[i].rank == max){
			bestOptions.push(i);
		}
	}
	
	//randomly choose, among these options, which option is the best
	var best = bestOptions[Math.floor(Math.random ( ) * bestOptions.length )]; 
		
	//make the move
	if (planList[best].direction == 0 ){
		computerMove(Units[1][best].x,Units[1][best].y,Units[1][best].x,Units[1][best].y+1);
	}
	else if (planList[best].direction == 1 ){
		computerMove(Units[1][best].x,Units[1][best].y,Units[1][best].x+1,Units[1][best].y);
	}
	else if (planList[best].direction == 2 ){
		computerMove(Units[1][best].x,Units[1][best].y,Units[1][best].x-1,Units[1][best].y);
	}
	else{
		computerMove(Units[1][best].x,Units[1][best].y,Units[1][best].x,Units[1][best].y-1);
	}
	//alert("computer turn over");
	//changeTurn(); //Set turn back to player1, the human player
};

/*
moveplan class, stores best move for a single unit, how well it ranks, and which direction is the best
*/
function movePlan(soldier){
	this.rank = -1; //how good this move is
	this.direction = -1; //which direction is the best move
	this.getBestMove = getBestMove; //function that determines the best move, sets rank and direction
	this.soldier = soldier;//the unit being moved
};

/*
determines the best possible move for the specified unit
sets the movePlans best move, setting the rank and direction
*/
function getBestMove(){
	
	if (this.soldier.isAlive == 0){
		this.rank = -10;
		return;
	}

	var temp;
	
	var max = checkMove(this.soldier, this.soldier.x,this.soldier.y+1)-1;
	this.rank =max;
	this.direction = 0;
	
	temp = checkMove(this.soldier, this.soldier.x+1,this.soldier.y);
	if ((temp == max)&&(Math.floor(Math.random ( ) * 2 ) <1 ) ){
		this.direction = 1;
	}
	else if (temp > max) {
		this.rank = temp;
		this.direction = 1;
		max = temp;
	}
	temp = checkMove(this.soldier, this.soldier.x-1,this.soldier.y);
	if ((temp == max)&&(Math.floor(Math.random ( ) * 2 ) <1 ) ){
		this.direction = 2;
	}
	else if (temp > max) {
		this.rank = temp;
		this.direction = 2;
		max = temp;
	}
	temp = checkMove(this.soldier, this.soldier.x,this.soldier.y-1)+1;
	if ((temp == max)&&(Math.floor(Math.random ( ) * 2 ) <1 ) ){
		this.direction = 3;
	}
	else if (temp > max) {
		this.rank = temp;
		this.direction = 3;
		//max = temp;
	}
	//Additional point if this unit is threatened in its current location
	if ((this.rank > 4)&&(rankNearbyThreats(this.soldier, this.soldier.x, this.soldier.y)>1)) this.rank++;

};

/*
Using whatever information the AI knows about the board
This will return a value determining how good that move is
*/
function checkMove(unit1, x2,y2){
	var rank = 0;

	if (!isValidSpot(x2, y2)) return -5; //cannot move to this location
	if (board[x2][y2]*board[unit1.x][unit1.y] > 0) return -5; //friendly unit on this location
	
	if (board[x2][y2]==0) { //empty spot
		rank += 7; 
	}
	else{ //Running into an opposing player
		var isOpponentKnown = Units[0][getBoardUnit(board[x2][y2])].isKnown;
		var hasOpponentMoved = Units[0][getBoardUnit(board[x2][y2])].hasMoved;
	
		if ((isOpponentKnown)||(!HasUnknownThreats(unit1.getThisSoldierRank()))){ //AI has attacked this unit before, knows who it is
			var fightResult = decideWinner(unit1.value, getBoardUnit(board[x2][y2]) );
			//the below line, to check for a flag, relies on a circumstance that can never occur
			//the AI cannot know what this unit is until it attacks, in which case the game is over
			//but, if the AI is to cheat in the future, this can be used
			//if (fightResult == 3) return 100; //Flag captured, just take it!
			if (fightResult == -2) return 50;
			if (fightResult == -1){
				if (unit1.isKnown) rank += 16;
				else rank += 14;
			}
			else if (fightResult == 0) rank += 8; //Both die, might still be best
			else  rank += 3; //Lose, but can still move
		}
		else{ //AI has not seen this unit before, will have to take it's chances
			if ( hasOpponentMoved){
				if (unit1.value != 0) rank += 10;		
			}
			else {
				if (unit1.value > 7) rank += 9;
				else if (unit1.value > 4) rank += 8;
				else if (unit1.value > 2) rank += 7;
				else rank += 4;
			}
		}
	}
	//Now, to take nearby units into consideration
	var threats = rankNearbyThreats(unit1, x2, y2);

	if (threats < 0){ //Not only not threatening, but there are other nice targets!
		//if (rank > 5) rank += 3;
		rank += 3;
	}
	else if (threats == 0){ //Overall, no threats, position is safe
		//if (rank > 5) rank += 1;
		rank += 1;
	}
	else { //Position has nearby enemies.
		if (threats > 2) rank -= 2;
		else rank -= 1;
	}
	return rank;
};

/*
Check all surrounding units related to the given position
rank based on how safe or dangerous that location is, based on surroundings
*/
function rankNearbyThreats(unit1, x2, y2){
	var rank = 0;
	//Check top
	rank += rankOneThreat(unit1, x2, y2+1);
	//Check right
	rank += rankOneThreat(unit1, x2+1, y2);
	//Check left
	rank += rankOneThreat(unit1, x2-1, y2);
	//Check bottom
	rank += rankOneThreat(unit1, x2, y2-1);

	//alert(rank);
	return rank;
};

/*
Ranks the threat of a single spot, for a moving unit.  Used to check for threats adjacent to a possible move
*/
function rankOneThreat(unit1, x2, y2){
	//alert(unit1.getThisSoldierRank()+""+unit1.x+" "+unit1.y+" "+x2+" "+y2);
	if (isValidSpot(x2, y2)){
		if(board[x2][y2] > 0){
			//var unitKnown = getUnitInfo(board[x2][y2]).isKnown;
			//if the opponent's unit has not been seen, and there are unknown threats to me
			if ((!getUnitInfo(board[x2][y2]).isKnown)&&(HasUnknownThreats(unit1.getThisSoldierRank()))) return Math.floor(Math.random()*3-1);
			else{
				if ((unit1.value == 1)&&(board[x2][y2] == 1)) return 10; //special importance for 1 and spy
				var fightResult = decideWinner(unit1.value,getBoardUnit(board[x2][y2]));
				if(fightResult == 1) {
					//alert("loser found");
					//if this is a mine, it is not a threat
					if (getBoardUnit(board[x2][y2])>32) return 0;
					//if the opponent knows this unit, it is more likely to be lost next turn
					if (unit1.isKnown) return 5;
					//unit is not known, this is not as big a threat
					return 2;
				}
				if (fightResult == 0) return 0;
				if (fightResult == -2) return -5;//special case for flag
				//alert("winner found");
				return -2;
			}
		}
	}
	return 0;
};

/*
Called by the AI after it has decided on a move.  
performs the move, and displays it
Note: this is also called when a human opponent lets this user know of the next move
*/
function computerMove(x1, y1, x2, y2){

	if ( decideWinner(getBoardUnit(board[x1][y1]), getBoardUnit(board[x2][y2]) ) == -2){
		//alert("new try at cathing win");
		setGameOver(1);
		//if (!isSinglePlay)
			//changeTurn();
		//setPlayerTurn(3);
		//alert(strCompCapture);
		
	}
	else {
		var items = boardArea.contentItems.toArray();
		items[y1*10+x1].image = imgRedListS[12];
		setTimeout("DelayedComputerMove("+x1+","+y1+","+x2+","+y2+")", 500);
	}
	/*var items = boardArea.contentItems.toArray();
	items[y1*10+x1].image = imgRedListS[12];
	//var moveResult = setTimeout("moveSoldier(x1,y1,x2,y2)", 500);
	stall(500);
	//setTimeout("noop()", 500);
	var moveResult = moveSoldier(x1,y1,x2,y2);
	if (moveResult == 0){ //basic move works
		items[y2*10+x2].image = getSpotImage(x2,y2,0);
		items[y1*10+x1].image = imgBlank;	
	}
	else if (moveResult == 1){ //defending unit forced forward
		items[y1*10+x1].image = getSpotImage(x1,y1,1);
		items[y2*10+x2].image = imgBlank;
	}
	else if (moveResult == 2){ //mine won, delete attacker but do not move defending mine
		items[y1*10+x1].image = imgBlank;
		
	}
	if (moveResult == -1){ //both locations are blank, everyone died
		items[y1*10+x1].image = imgBlank;
		items[y2*10+x2].image = imgBlank;
	}*/
};

function DelayedComputerMove( x1, y1, x2, y2){
	
	//items[y1*10+x1].image = imgRedListS[12];
	//var moveResult = setTimeout("moveSoldier(x1,y1,x2,y2)", 500);
	//stall(500);
	//setTimeout("noop()", 500);
	var moveResult = moveSoldier(x1,y1,x2,y2);
	if (moveResult == 3) return;
	
	var items = boardArea.contentItems.toArray();
	if (moveResult == 0){ //basic move works
		items[y2*10+x2].image = getSpotImage(x2,y2,0);
		items[y1*10+x1].image = imgBlank;	
	}
	else if (moveResult == 1){ //defending unit forced forward
		items[y1*10+x1].image = getSpotImage(x1,y1,1);
		items[y2*10+x2].image = imgBlank;
	}
	else if (moveResult == 2){ //mine won, delete attacker but do not move defending mine
		items[y1*10+x1].image = imgBlank;
		
	}
	if (moveResult == -1){ //both locations are blank, everyone died
		items[y1*10+x1].image = imgBlank;
		items[y2*10+x2].image = imgBlank;
	}
   // if (!isSinglePlay)
			//changeTurn();	
}
