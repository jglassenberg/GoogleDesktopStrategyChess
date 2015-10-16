/************************************
	const
************************************/
var blocksize = 13; //size of each block on the board
var textheight = 18; //size of the text displayed

/***********************************
	Unit Selection variables
*************************************/
var isUnitSelected = false; //for user. determines if he just clicked on a unit in a blcok, or already clicked on one
var selectedX; //x value of currently selected block
var selectedY; //y value of currently selected block

/********************
Board storage variables
***************************/

var itemsGlobal;

/*************************************
	Labels above the board
*************************************/
//var itemTurnTotal; //displays the number of turns
//var itemGoWait; //display "Go!" or Wait

/*
draw the board
*/
function DrawBoard() {

  //EnableMenuFlip();
  
  isUnitSelected = false;
  boardArea.removeAllContentItems();

  itemsGlobal = new Array();
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      //squares[items.length] = "";
      var item = new ContentItem();
      item.image = getSpotImage(j,i,0);
      item.flags = gddContentItemFlagNoRemove;
      item.snippet = itemsGlobal.length;
      item.onDetailsView = OnClicked;
      item.setRect(j*blocksize, i*blocksize+textheight, blocksize, blocksize);
      itemsGlobal.push(item);
    }
  }
  
  // add exit button
  var quit = new ContentItem();
  quit.heading = strQuit;
  quit.onDetailsView = OnQuitNotify;
  quit.flags = gddContentItemFlagNoRemove;
  quit.SetRect(0, 10 * blocksize+textheight, 60, textheight);
  itemsGlobal.push(quit);

 // itemTurnTotal = GetLabelManual(70, 0, 20, strTurnLabel + "0");
  //items.push(itemTurnTotal);
  //AddLabelManual(70, 0, 20, strTurnLabel + "0");
  itemsGlobal.push(GetLabelManual(70, 0, 60, strTurnLabel + "0"));
  if (isPlayer1){
	//itemGoWait = GetLabelManual(47, 0, 20, strGo);
	//AddLabelManual(47, 0, 20, strGo);
	itemsGlobal.push(GetLabelManual(20, 0, 60, strGo));

  }
  else {
	//itemGoWait = GetLabelManual(47, 0, 20, strWait);
	//AddLabelManual(47, 0, 20, strWait);
	itemsGlobal.push(GetLabelManual(20, 0, 60, strWait));
  }
  //items.push(itemGoWait);

  //"No" button for cancelling game quit (item[103])
  itemsGlobal.push(GetButtonManual(0, 0, 0, "", OnReturnGame));
  
  boardArea.contentItems = itemsGlobal;

  EnableFlip(); //Player is now allowed to flip the board
  SetStartTurn();
  //printScore();
  //TestStartPosition();
};

/*
Gets the image that the player should see
either his own image, or a "?" for the opponent
possibly not used anymore
*/
function getSpotImage(x, y, justFaught){
	if (!isValidSpot(x,y)) return imgForbidden;
	if (board[x][y]==0) return imgBlank;
	if (board[x][y] > 0) {
		//if ((isPlayer1)||(justFaught)) return imgBlueList[getSoldierRank(getBoardUnit(board[x][y]))];
		return imgBlueList[getSoldierRank(getBoardUnit(board[x][y]))];
		//return imgBlueList[12];
	}
	return imgRedList[12];
	//if ((isPlayer1)&&(!justFaught)) return imgRedList[12];
	//return imgRedList[getSoldierRank(getBoardUnit(board[x][y]))];
};

/*
Gets the highlighted version of the image on that spot
for a recently selected unit, or when the game is over
*/
function getSpotImageC(x, y){
	if (!isValidSpot(x,y)) return imgForbidden;
	if (board[x][y]==0) return imgBlank;
	if (board[x][y] > 0) return imgBlueListS[getSoldierRank(getBoardUnit(board[x][y]))];
	return imgRedListS[getSoldierRank(getBoardUnit(board[x][y]))];
};

/*
displays for the user
display can be "?" if opposing player, but also dependant on whether the opponent has just attacked
*/
function getSpotImageR(x,y){
	if (!isValidSpot(x,y)) return imgForbidden;
	if (board[x][y]==0) return imgBlank;
	if (board[x][y] > 0){
		return imgBlueList[getSoldierRank(getBoardUnit(board[x][y]))];
		/*if (isPlayer1) return imgBlueList[getSoldierRank(getBoardUnit(board[x][y]))];
		if (getUnitInfo(board[x][y]).justMoved){
			getUnitInfo(board[x][y]).justMoved = false;
			return imgBlueList[getSoldierRank(getBoardUnit(board[x][y]))];
		}
		return imgBlueList[12];*/
	}
	//if (!isPlayer1) return imgRedList[getSoldierRank(getBoardUnit(board[x][y]))];
	if (getUnitInfo(board[x][y]).justMoved) {
		//if (!GetCanResetImg()){ //This is related to refresh, after timeOut was applied. only change this setting when ready
			getUnitInfo(board[x][y]).justMoved = false;
		//}
		return imgRedList[getSoldierRank(getBoardUnit(board[x][y]))];
	}
	return imgRedList[12];
};

function GetRedSpot(x,y){
	return imgRedList[getSoldierRank(getBoardUnit(board[x][y]))];
};

/*
for board setup, make sure all units are properly sized
may need to be changed for better user customizeability
*/
function ResizeBoard() {
  var margin = Math.max(0, (plugin.window_width - 10 * blocksize) / 2);
  var items = boardArea.contentItems.toArray();
  for (var i = 0; i < items.length-3; i++) {
    var index = items[i].snippet;
    if (index != "") {
      // must be a board item, since they have 0...8 as their snippet
      var x = (index % 10);
      var y = Math.floor(index / 10);
      items[i].SetRect(margin + x * blocksize, y * blocksize, blocksize, blocksize);
    }
  }
};

/*
Called after each turn, so that users see how the new board looks, what any enemy units look like if they just faught
*/
function RefreshBoard(){
	var x;
	var y;
	var items = boardArea.contentItems.toArray();
	//boardArea.removeAllContentItems();
	for (var i = 0; i < 100; i++) {
		x = i%10;
		y = Math.floor(i / 10);
		items[i].image = getSpotImageR(x,y);
		//items[i].image = getSpotImage(x,y,0);
	}
	//boardArea.contentItems = itemsGlobal;
};

/*
Called when the game is over
Displays all units, no "?"
Displays them as highlighted so you know the game is over
*/
function DisplayEndBoard(){
	var x;
	var y;
	//alert("end board");
	
	//var items = boardArea.contentItems.toArray();
	boardArea.removeAllContentItems();
	for (var i = 0; i < 100; i++) {
		x = i%10;
		y = Math.floor(i / 10);
		itemsGlobal[i].image = getSpotImageC(x,y);
	}
	itemsGlobal[102].heading = strGameOver;
	itemsGlobal[102].setRect(0,0,70,textheight);
	
	boardArea.contentItems = itemsGlobal;
};

/*******************************************
		Event handler for contentarea items
********************************************/
/*
The user has clocked on a board item during game play
*/
function OnClicked(item){
	//if the game is over, user can no longer make moves
	if ((item.snippet != "")&&(isGameOver())) return;
        if (isCancelState()) return; //everything should be disabled at cancel prompt
	//if multiplayer, and not your turn, cannot click
	//if (!isSinglePlay){
		if(getPlayerTurn() == 1) return;
		//if ((getPlayerTurn() == 1)&&(!isPlayer1)) return;
		//if ((getPlayerTurn() == 0)&&(isPlayer1)) return;
	//}
	
	var items = boardArea.contentItems.toArray();
	var x = item.snippet%10;
	var y = Math.floor(item.snippet / 10);
	//alert(board[x][y]);
	if (isUnitSelected){
		if (isSameTeamUnit(x,y)){ //user is choosing a different unit
			if (isSelectableUnit(x,y)){
				items[selectedY*10+selectedX].image = getSpotImage(selectedX,selectedY, 0);
				selectedX=x;
				selectedY=y;
				items[item.snippet].image = getSpotImageC(selectedX,selectedY);
			}
			else{ //clicked on a flag or mine, treated as a de-selection
				items[selectedY*10+selectedX].image = getSpotImage(selectedX,selectedY,0);
				isUnitSelected = false;
			}
		}
		else{//User might be moving piece
			if (isValidMove(x,y)){
				var moveResult = moveSoldier(selectedX,selectedY,x,y);
				//if the game is over, end here
				if (isGameOver()) return;
				if (moveResult == 0){ //basic move works
					items[item.snippet].image = getSpotImage(x,y,0);
					items[selectedY*10+selectedX].image = imgBlank;	
				}
				else if (moveResult == 1){ //defending unit forced forward
					//items[selectedY*10+selectedX].image = getSpotImage(selectedX,selectedY,1);
					items[selectedY*10+selectedX].image = GetRedSpot(selectedX,selectedY);
					items[item.snippet].image = imgBlank;
				}
				else if (moveResult == 2){ //mine won, delete attacker but do not move defending mine
					items[selectedY*10+selectedX].image = imgBlank;
					//items[item.snippet].image = getSpotImage(selectedX,selectedY,1);
					items[item.snippet].image = imgRedList[10];
				}
				if (moveResult == -1){ //both locations are blank, everyone died
					items[selectedY*10+selectedX].image = imgBlank;
					items[item.snippet].image = imgBlank;
				}
				//if multiplayer, move message must be sent to opponent
				if (!isSinglePlay){
					changeTurn(); //is now opponent's turn
					try {
						//move data is sent in unique format, so that all 4 necessary variables are stored in 1
						googleTalk.SendTalkData(friend_user_id, item.snippet*100+selectedY*10+selectedX);
					} 
					catch (e) {
						alert(strConnectionError);
						DisplayMainMenu();
					}
				}
				else{
					changeTurn(); //Set turn back to player1, the human player
				}
			}
			else{
				items[selectedY*10+selectedX].image = getSpotImage(selectedX,selectedY,0);
				//isUnitSelected = false;
			}
			isUnitSelected = false;
		}
	}
	else{ //make sure this is 
		//make sure this is the player's unit, and not a mine or flag, which cannot be moved
		if ( (isMyUnit(x,y))&&(getSoldierRank(getBoardUnit(board[x][y])) < 10) ){
			isUnitSelected = true;
			selectedX=x;
			selectedY=y;
			items[item.snippet].image = getSpotImageC(selectedX,selectedY);
		}
	}
	
};


/**************************************************************
			Utility functions
****************************************************************/

/*
Returns true if the board unit on this spot is on the same team as the selected spot
*/
function isSameTeamUnit(x,y){
	if (board[x][y]*board[selectedX][selectedY] > 0) return true;
	return false;
};

/*
returns true if this unit is on the current player's team
*/
function isMyUnit(x,y){
	if (board[x][y] > 0) return true;
	//if ((playerTurn == 0)&&(board[x][y] > 0)) return true;
	//if ((playerTurn == 1)&&(board[x][y] < 0)) return true;
	return false;
};

/*
Returns true if the board unit on this spot can be selected 
Must be a moveable unit
*/
function isSelectableUnit(x,y){
	if(board[x][y] == 0) return false;
	
	var rank = getSoldierRank(getBoardUnit(board[x][y]));
	if ((rank == 10)||(rank==11)) return false;
	return true;
};

/*
Returns true if the square is a valid spot to move, and in appropriate distance (1 up, down, right, or left)
*/
function isValidMove(x,y){
	if (isValidSpot(x,y) == 0) return false;
	if ((Math.abs(x-selectedX)==1)&&((Math.abs(y-selectedY)==0))) return true;
	if ((Math.abs(x-selectedX)==0)&&((Math.abs(y-selectedY)==1))) return true;
	return false;
}
