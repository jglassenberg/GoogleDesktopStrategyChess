/*****************************
		Variables
*******************************/

var totalTurns = 0;
var playerTurn = 0; //0 means positive (blue), 1 negative (red)

var gameOver = false;
//var canResetImg = false;

/******************************************
		Turn Hanlders
********************************************/
/*
controls who's turn it is to make a move. also handles board display in turn change
*/
function changeTurn(){
	if (playerTurn ==0) {
		//if single player mode, just let the computer make a move
		if (isSinglePlay){
		    setPlayerTurn(1);
			//SetCanResetImg(false); //make sure visible units stay visible here
		    //RefreshBoard();
			printScore();
			//SetCanResetImg(true); //opponent's visible units can be set back to "?"
		    //Wait half a second before letting the computer start making its move
			setTimeout("ComputerTurn()", 500);
			//ComputerTurn();
		}
		else{ //multiplayer mode.  User will now have to wait for friend's move
			setPlayerTurn(1);
			//SetCanResetImg(false); //make sure visible units stay visible here
			if(!isPlayer1) {
				nextTurn();
			}
			//RefreshBoard();
			printScore();
			
		}
		//RefreshBoard();
	}
	else {
		//Wait a little over half a second.  The opponent has already moved, but there is a 500 ms delay so that the user can better see the move
		//SetCanResetImg(true); //opponent's visible units can be set back to "?"
		setTimeout("MultiPlayerMyTurn()", 550);	
	}
	//RefreshBoard();
	//nextTurn();
};

/*
Called when the human player just made a move in single player mode
Computer makes it's move, board is refreshed
*/
function ComputerTurn(){
	ForgetUnitRanks(); //AIDifficulty.js, will cause AI to forget some opposing units' ranks
	decideMove();	
	//wait another half a second.  The computer made it's move, but takes 500 ms to highlight it's unit and move for the person to see
	if (!isGameOver()){
		setTimeout("FinishComputerTurn()", 550); //The board is refreshed after move.
	}
	else {
		//if the computer isnt out of turns, it caught the flag.
		if (lblWarning.innerText != strCompSurrender) DisplayWarning(strCompCapture);
		DisplayEndBoard();
	}
};

/*
After the computer has finally made its move, time to refresh the board, go to next turn
*/
function FinishComputerTurn(){
	//chack to make sure the human player can still move
	nextTurn();
			if (!CanMove()){
				//Todo: handle flag capture case
				setGameOver(1); //The game is over, no more turns
				//alert(strYouCantMove);
				DisplayWarning(strYouCantMove);
				DisplayEndBoard();
			}
			else{
				RefreshBoard();
				printScore();
			}
			
			setPlayerTurn(0);
};

/*
Called in multiplayer mode, when ready to switch turn back to local machine
User is no longer waiting, but ready to go.
*/
function MultiPlayerMyTurn(){
		/*if (isGameOver()){
			//setGameOver(1); //The game is over, no more turns
			alert(strFriendWon);	
			DisplayEndBoard();
		}*/
		if (TestCanMove()){
			if (isPlayer1){
				nextTurn();
			}
			RefreshBoard();
			printScore();		
		}	
		
		setPlayerTurn(0);
};

function TestCanMove(){
	if (!CanMove()){
			//Todo: handle flag capture case
			setGameOver(1); //The game is over, no more turns
			//alert(strYouCantMove);
			DisplayWarning(strYouCantMove);
			try{
				googleTalk.SendTalkData(friend_user_id, msgNoMoves);
			} catch (e){
				return 0;
			}
			DisplayEndBoard();
			return 0;
		}
		return 1;
};

/*
Increment turns
*/
function nextTurn(){
	totalTurns++;
};

/********************************************
		Utilities
********************************************/

/*
returns the total number of turns in this game so far
*/
function getTotalTurns(){
	return totalTurns;
};

/*
sets the turn to the provided player
*/
function setPlayerTurn(turn){
	playerTurn = turn;
	var items = boardArea.contentItems.toArray();
	if (items.length > 102){
	if (playerTurn == 0){
		items[102].heading = strGo;
	}
	else if (playerTurn == 1){
		items[102].heading = strWait;
	}
	else {
		//alert("display game over note");
		items[102].heading = strGameOver;
		items[102].setRect(0,0,70,textheight);
	}
	}
};

function SetStartTurn(){
	if (isSinglePlay) playerTurn = 0;
    else if (isPlayer1) playerTurn = 0;
    else playerTurn = 1;
};

function getPlayerTurn(){
	return playerTurn;
};

/*
sets the status of the game, if it is over or still running
*/
function setGameOver(over){
	gameOver = over;
};

/*
These are used to justify setting an opponent's visible unit back to "?"
*/
/*function SetCanResetImg(val){
	canResetImg = val;
}

function GetCanResetImg(){
	return canResetImg;
}*/

/*
returns whether or not the game is over (or still running)
*/
function isGameOver(){
	return gameOver;
}
