/**********************************
		Setup variables for keeping in sync with opponent
*************************************/

var friend_user_id = ""; //stores the gtalk id of the other player
var isReady = false; //set when this user has finished unit setup
var isFriendReady = false; //set if the other player has finished unit setup
var hasSentUnits = false;// set if this player has successfully sent all units to the other
var numReceivedUnits = 0; //stores the number of units received by the other player in setup

/*************************************************************
		Message Variables
**************************************************************/
// Talk messages
var msgStart = "start";
var msgCancel = "cancel";
var msgAccept = "accept";
var msgDecline = "decline";
var msgCant = "cant";
var msgForfeit = "forfeit";
var msgNoMoves = "noMoves";
var msgReady = "ready";
var msgWon = "won";
var msgReject = "reject";

googleTalk.onReceiveTalkData = OnReceiveTalkData; //function for handling  receiving of data
/*
Called when receiving messages from other players
*/
function OnReceiveTalkData(friend, data) {
  //alert("message received "+data);
  
  //switch(data){
  if (data == msgStart) {
    if (isPlaying){
	  try{
		googleTalk.SendTalkData(friend.user_id, msgCant);
	  } catch(e){
		//if could not warn the user, user is disconnected so nothign can be done
	  }
	}
    else if (confirm(friend.name + " " + strWantsToPlay)) {
	  isPlayer1 = false;
	  isSinglePlay = false;
	  isPlaying = true;
	  //boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	  drawSetupPage();
	  //setPlayerTurn(1);
	  try{
        friend_user_id = friend.user_id;
        googleTalk.SendTalkData(friend.user_id, msgAccept);
      }
	  catch(e){
	    alert(strConnectionError);
		DrawFriends();
	  }  
    } else {
	  try{
        googleTalk.SendTalkData(friend.user_id, msgDecline);
	  } catch(e){
	   //user could have disconnected before rejection, but nothing can be done
	  }
    }
  } 
  else if (data == msgAccept) {
	//alert(friend_user_id + " "+friend.user_id);
    // don't start a game if this user cancelled the request, but the friend said yes
    if (friend_user_id == friend.user_id) {
	  alert(friend.name+" " + strAccepted);
	  isPlayer1 = true;
	  isPlaying = true;
	  drawSetupPage();
    }
	else { //User was to late to accept, the offer was cancelled
	  try{
        googleTalk.SendTalkData(friend.user_id, msgReject);
      }
	  catch(e){
		//I guess the user already moved on if this happens, so dont worry about it
	  }
	}
  }
  else if (data == msgReject){
     //This happens when the user accepted, but the other user cancelled while waiting
	 //The setup page is pulled out beforehand, then the user is disappointend :(
	//However, the user may have already cancelled, so we check for that
	 if (friend_user_id == friend.user_id){
            AlertReject(friend.name);
        //alert(strReject);
	  //  DisplayMainMenu();
	}
	//otherwise, do nothing
  }
  else if (data == msgDecline) {
    //This only matters if still waiting for that user's response
    if (friend_user_id == friend.user_id) {
	AlertDecline(friend.name);
      //alert(friend.name + " " + strDecline);
	//  friend_user_id = "";
	  //DrawFriends();
      //DisplayMainMenu();
	}
  } 
  else if (data == msgCant){
	 //This only matters if still waiting for that user's response
    if (friend_user_id == friend.user_id) {
        AlertCant(friend.name);
        //alert(friend.name + " " + strCant);
	//  friend_user_id = "";
	  //DrawFriends();
      //DisplayMainMenu();
	}	
  }
  else if (data == msgCancel) {
    // friend cancelled game
	//alert("msgCancel received");
    if (friend_user_id == friend.user_id) {
	AlertCancel(friend.name);
      //alert(friend.name + " " + strFriendCancelled);
      //DisplayMainMenu();
    }
  } 
  else if (data == msgForfeit) {
  //alert("msgForfeit received");
    // friend cancelled game
    if (friend_user_id == friend.user_id) {
	AlertEndGame(friend.name,strFriendForfeited);
      /*alert(friend.name + " " + strFriendForfeited);
	  setGameOver(1);
      DisplayEndBoard();*/
    }
  } 
  else if (data == msgReady){
    //alert("msgReady received");
	if (friend_user_id == friend.user_id) {
	  if(isReady){
		//alert("we are both ready, time to send units");
		SendMyUnits();
	  }
	  else{
		//alert("but you are not ready");
		//This means that the other user finished setup, and is waiting
		isFriendReady = true;
		lblScore.innertext += strFriendWait;
	  }
	}
  }
  else if (data == msgWon) {
    if (friend_user_id == friend.user_id) {
	AlertEndGame(friend.name,strFriendWon);
	 /* setGameOver(1); //The game is over, no more turns
      alert(friend.name + " " + strFriendWon);
      //DisplayMainMenu();
	  DisplayEndBoard();*/
	}
  } 
  else if (data == msgNoMoves){
    if (friend_user_id == friend.user_id) {
	  AlertEndGame(friend.name,strFriendCantMove);
	  /*setGameOver(1); //The game is over, no more turns
	  alert(friend.name +" " + strFriendCantMove);
	  DisplayEndBoard();*/
   }
  }
  else {
	//alert("numerical data: "+data);
	if (data > 0){
		// must be a movement
		HandleOpponentMove(data);
		changeTurn(); //turn is now own's to make
    
	}
	if (data < 0){
		//friend his sending the location of his initial board items
		HandleOpponentSetup(data);
	}
  }
};



/*
Upon receiving a message of a move, this is called
Make move on own board, after opponent made one
*/
function HandleOpponentMove(data){
	var item1 = data % 100;
	var item2 = Math.floor(data / 100);
	
	var xOld = item1 % 10;
	var yOld = Math.floor(item1 / 10);
	
	var xNew = item2 % 10;
	var yNew = Math.floor(item2 / 10);
	
	computerMove(xOld, yOld, xNew, yNew); //In AI right now, but performs the move on "hisUnits"
};

/*
The opponent sent the location of one unit.  
This lets the player know where to place that unit at setup
*/
function HandleOpponentSetup(data){
	var unitNum = Math.floor((-data) / 100);
	var x = ((-data) % 100) % 10;
	var y = (Math.floor((-data) / 10)) % 10;
	//alert(data+"new opponentunit:" +unitNum+" "+x+" "+y+" "+numReceivedUnits+" "+hasSentUnits);
	board[x][y] = -unitNum - 1;
	//alert("new board value set to "+ (-unitNum-1));
	Units[1][unitNum].setSoldierLocation(x,y);
	//alert("new board value set to "+ (-unitNum-1));
	
	numReceivedUnits++;
	
	CheckCanStart();
};

/*
Send messages to your friend, regarding the setup of your units
*/
function SendMyUnits(){
	DisplaySendingUnits();
	var errorCount = 0;
	for (var i = 0; i < 40; i++){
		try {
			//message must include unit number, x location, and y location.  must be negative to indicate the type of message
			googleTalk.SendTalkData(friend_user_id, -(i*100 + Units[0][i].y*10 + Units[0][i].x));
		} catch (e) {
			if (errorCount > 10){
				alert(strConnectionError);
				DisplayMainMenu();
				return;
			}
			errorCount++;
			i--;
		}
	}

	//all units have been sent.  once all units are received, the game can start
	hasSentUnits = true;
	
	//checks if all units are sent and received, in which the game can start
	CheckCanStart();
};

/*
Determines if all units have been sent to the other player,
and the other player has sent all units
if so, print the board to play the game
*/
function CheckCanStart(){
	//alert("ccheck start: "+numReceivedUnits+" "+hasSentUnits);
	if ((numReceivedUnits == 40)&&(hasSentUnits)){
		//alert("time to draw");
		boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
		DrawBoard();
		printScore();
		TestStartPosition();
		/*if (!TestCanMove()){
			alert(strMineBlock);
		}*/
	}
};

function DisplaySendingUnits(){
	 boardArea.removeAllContentItems();
	//boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	boardArea.contentFlags = gddContentFlagHaveDetails;
  
  

  AddButtonAuto(strCancel, OnCancelToFriends);
  AddLabelAuto(strSendingUnits);
};

function DisplayWaitForAccept(){
	// add cancel button
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;
  
  AddButtonAuto(strCancel, OnCancelToFriends);
  AddLabelAuto(strWaitingForResponse);
  
};

/*************************************************************
	Utilities
************************************************************/


/*
go through my units, and determine if a unit can move
returns true if at least one unit can move somewhere
returns false
*/
function CanMove(){
	// go through each unit
	for (var i = 0; i < 33; i++){
		//if one unit can move, then the player can still move
		if (CanMoveUnit(i)) return true;
	}
	//otherwise player cannot move
	return false;
};

/*
takes a unit num, determines if that unit is able to move somewhere
*/
function CanMoveUnit(unitVal){
	if (Units[0][unitVal].isAlive == 0) return false;
	//check all 4 adjacent spots for this unit
	if ((isValidSpot(Units[0][unitVal].x, Units[0][unitVal].y+1))&&(board[Units[0][unitVal].x][Units[0][unitVal].y+1]==0)) return true;
	if ((isValidSpot(Units[0][unitVal].x, Units[0][unitVal].y-1))&&(board[Units[0][unitVal].x][Units[0][unitVal].y-1]==0)) return true;
	if ((isValidSpot(Units[0][unitVal].x+1, Units[0][unitVal].y))&&(board[Units[0][unitVal].x+1][Units[0][unitVal].y]==0)) return true;
	if ((isValidSpot(Units[0][unitVal].x-1, Units[0][unitVal].y))&&(board[Units[0][unitVal].x-1][Units[0][unitVal].y]==0)) return true;
	//if it gets here, this unit cannot move
	return false;
};

/*********************************************************************
	Button Events
************************************************************************/

function OnMainClick(item){
	DisplayMainMenu();
};

function OnStartMultiPlayer(item){
	//alert("sending start data "+item.snippet);
	friend_user_id = item.snippet;
	try {
		googleTalk.SendTalkData(friend_user_id, msgStart);
	} catch (e) {
		alert(strCantConnect);
		//DisplayMainMenu();
	}
	DisplayWaitForAccept(); //Set the user to wait for an accept
	//drawSetupPage();
};

/*
Called when a user has been selected
tries to connect to that user
*/
function OnStartMulti(item) {
  // Start a multi-player game
  //state = stateMultiPlayerWaiting;
  friend_user_id = item.snippet;
  isPlaying = true;
  try {
    googleTalk.SendTalkData(friend_user_id, msgStart);
  } catch (e) {
    alert(strCantConnect);
    OnMainMenu();
  }
};

function OnCancelToFriends(){
	friend_user_id = "";
	isPlaying = false;
	DrawFriends();
}
