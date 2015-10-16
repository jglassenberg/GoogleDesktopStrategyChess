/*****************************************************************************
*****************************************************************************
			SetupPage:
	For handling the setup page, for the user to place units before the game starts
*****************************************************************************
*****************************************************************************/

/*********************************************
	Variables
******************************************/
var selectedItem;// stores the snippet of the item currently selected
var isWaiting = false; //for multiplayer. when waiting after setup, user cannot do anything
//used to store a label that is displayed when the user clicks on "Play" prematurely
//var isPlayWarned = false;
//var playWarning1;
//var playWarning2;

/*******************************************************************8
		Setup functions
***********************************************************************/
/*
Draws the page for the user to set up his units
*/
function drawSetupPage(){
	//alert("drawing setup");
	isUnitSelected = false;
	boardArea.removeAllContentItems();
	boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	
	//lblScore.innerText = strSetup+"\n";

  itemsGlobal = new Array();
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 10; j++) {
      //squares[items.length] = "";
      var item = new ContentItem();
      item.image = getSpotImageSetup(j,i);
      item.flags = gddContentItemFlagNoRemove;
      item.snippet = itemsGlobal.length;
      item.onDetailsView = OnSetupClicked;
      item.setRect(j*blocksize, i*blocksize+textheight, blocksize, blocksize);
      itemsGlobal.push(item);
	  
	  board[j][i] = -1;
    }
  }
  for (var i = 6; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      //squares[items.length] = "";
      var item = new ContentItem();
      item.image = imgBlueList[getSoldierRank(itemsGlobal.length - 60)];
      item.flags = gddContentItemFlagNoRemove;
      item.snippet = itemsGlobal.length;
      item.onDetailsView = OnSetupClicked;
      item.setRect(j*blocksize, i*blocksize+textheight, blocksize, blocksize);
      itemsGlobal.push(item);
	  
	  board[j][i] = item.snippet-60;
    }
  }
  
  // add playbutton
  itemsGlobal.push(GetButtonManual(0, 10*blocksize+textheight, 30, strPlay, OnPlayNotify));
 
  // add cancel button
  itemsGlobal.push(GetButtonManual(90, 10*blocksize+textheight, 40, strCancel, OnSetupCancel));
  
  //add button to use a random setup
  itemsGlobal.push(GetButtonManual(23, 11*blocksize+textheight-3, 68, strRandomSet, OnSetRandomNotify));
  
  // add setup Label
  itemsGlobal.push(GetLabelManual(47, 0, 40, strSetupLabel));
  
  boardArea.contentItems = itemsGlobal;
  //alert("done drawing setup");

  EnableFlip();
};

/*************************************************************
	Event handlers
*************************************************************/

/*
Called when the "Play" button is clicked
*/
function OnPlayNotify(item){
	//alert("play clicked");
	if (!isValidSetup()){
		lblWarning.innerText = strBadSetup;
		setTimeout("RemovePlayWarning()", 5000);
	}
	else if(isSinglePlay){ //if single player mode, go right into game
		DisableFlip(); //user cannot flip board items at this point
		RemovePlayWarning();

		fillPlayerList();
		loadUnits(); //prepare a list for the setup of the computer unit
		setupComputerPlayer(getUnits()); //load into computer
		DrawBoard();
		printScore();
		TestStartPosition();
	}
	else{ //a bit trickier, as both players have to be ready
		DisableFlip(); //user cannot flip board items at this point
		RemovePlayWarning();

		PrepareHisUnits();
		fillPlayerList(); //have your units ready before your opponents
		isReady = true;
		try {	
			//let friend know that i am ready
			googleTalk.SendTalkData(friend_user_id, msgReady);
			
		} catch (e) {
			alert(strConnectionError);
			OnMainMenu();
		}
		//if i knew that my friend was already ready, time to send my units
		if (isFriendReady){
			SendMyUnits();
		}
		else{
			DisplayFriendWait();
		}
	}
};

/*
Called when a box on the setup board is clicked
*/
function OnSetupClicked(item){
	
	if (isCancelState()) return; //everything should be disabled at cancel prompt

	var items = boardArea.contentItems.toArray();
	
	if (isUnitSelected){
		if (hasSetupItem(item.snippet)){
			items[selectedItem].image = imgBlueList[getSoldierRank(getBoardItem(selectedItem))];
			items[item.snippet].image = imgBlueListS[getSoldierRank(getBoardItem(item.snippet))];
			selectedItem = item.snippet;
		}
		else if(item.snippet > 19){ //if selected a valid spot to move unit
			var xOld = selectedItem%10;
			var yOld = Math.floor(selectedItem / 10);
			var xNew = item.snippet%10;
			var yNew = Math.floor(item.snippet / 10);		
			
			items[item.snippet].image = imgBlueList[getSoldierRank(getBoardItem(selectedItem))];
			items[selectedItem].image = getSpotImageSetup(xOld, yOld);
			
			board[xNew][yNew] = getBoardItem(selectedItem);
			board[xOld][yOld] = -1;
			
			selectedItem = item.snippet;
			
			isUnitSelected = false;
		}
		else{ //should not move unit there, reset previous image
			items[selectedItem].image = imgBlueList[getSoldierRank(getBoardItem(selectedItem))];
			isUnitSelected = false;
		}
	}
	else {
		//alert(item.snippet);
		if (hasSetupItem(item.snippet)){
			isUnitSelected = true;
			items[item.snippet].image = imgBlueListS[getSoldierRank(getBoardItem(item.snippet))];
			selectedItem = item.snippet;
		}
	}
};

/*
Called when user clicks on setup random button, to try a random piece setup
*/
function OnSetRandomNotify(item){
	//if (isCancelState()) return; //everything should be disabled at cancel prompt
	isUnitSelected = false;
	RandomSetup(); //just call this in SetupSelect.js, and the operation is performed
};

/**********************************************************************
		board change handlers
***********************************************************************/
/*
called when ready to play.  the user's list of units are to be filled with his setup, as well as the play board
*/
function fillPlayerList(){
	Units[0] = new Array(40);
	for (var i = 2; i < 6; i++){
		for (var j = 0; j < 10; j++){
			Units[0][board[j][i]] = new soldier(board[j][i]);
			Units[0][board[j][i]].setSoldierLocation(j,i);
			board[j][i-2] = board[j][i]+1;
			board[j][i] = 0;
		}
	}
	//units must be flipped for proper placement
	var temp;
	for (var i = 0; i < 2; i++){
		for (var j = 0; j < 10; j++){
			temp = board[j][i];
			Units[0][board[j][i]-1].setSoldierLocation(j,3-i);
			board[j][i] = board[j][3-i];
			Units[0][board[j][3-i]-1].setSoldierLocation(j,i);
			board[j][3-i] = temp;
			
		}
	}
	for (var i = 0; i < 4; i++){
		for (var j = 0; j < 5; j++){
			temp = board[j][i];
			Units[0][board[j][i]-1].setSoldierLocation(9-j,i);
			board[j][i] = board[9-j][i];
			Units[0][board[9-j][i]-1].setSoldierLocation(j,i);
			board[9-j][i] = temp;
			board[j][i];
			board[9-j][i];
		}
	}
	//if this is player2, the units have to be flipped to the other side of the board
	if(!isPlayer1){
		FlipMyUnits();
	}
	//Goes to AIDifficulty.js
	SetMyVisibility();
};

function FlipMyUnits(){
	for(var i = 0; i < 40; i++){
		board[9-Units[0][i].x][9-Units[0][i].y] = board[Units[0][i].x][Units[0][i].y];
		//board[10-Units[0][i].x][10-Units[0][i].y] = -board[Units[0][i].x][Units[0][i].y];
		board[Units[0][i].x][Units[0][i].y] = 0;
		Units[0][i].x = 9-Units[0][i].x;
		Units[0][i].y = 9-Units[0][i].y;
	}
};

function PrepareHisUnits(){
	Units[1] = new Array(40);
	for (var i = 0; i < 40; i++){
		Units[1][i] = new soldier(i);
	}
};

function DisplayFriendWait(){
  // add note that list is being loaded
  boardArea.removeAllContentItems();
	
	boardArea.contentFlags = gddContentFlagHaveDetails;
  var waitSign = new ContentItem();
  waitSign.heading = strWaitFriend;
  waitSign.flags = gddContentItemFlagStatic;
  waitSign.SetRect(0, 0, 200, textheight);
  boardArea.addContentItem(waitSign, gddItemDisplayInSidebar);
  
  // add cancel button
  var cancel = new ContentItem();
  cancel.heading = strCancel;
  cancel.onDetailsView = OnWaitCancel; //Here, we ask the userr to confirm cancel
  cancel.flags = gddContentItemFlagNoRemove;
  cancel.SetRect(0, 11 * blocksize, 80, textheight);
  boardArea.addContentItem(cancel, gddItemDisplayInSidebar);
  
  lblScore.innerText = "";
};

function TestStartPosition(){
	if(!CanMove()){
		setGameOver(1); //The game is over, no more turns
		//alert(strYouCantMove);
		DisplayWarning(strYouCantMove);
		if (!isSinglePlay){
			try{
				googleTalk.SendTalkData(friend_user_id, msgNoMoves);
			} catch (e){
			}
		}
		setPlayerTurn(3);
	}
};
/*******************************************************
		Utilities
*******************************************************/

/*
gets the item displayed on the board, based on an item snippet
*/
function getBoardItem(itemNum){
	var x = itemNum%10;
	var y = Math.floor(itemNum / 10);
	return board[x][y];
};

/*
determines whether the selected item has a soldier on it
*/
function hasSetupItem(itemNum){
	if (getBoardItem(itemNum) > -1) return true;
	return false;
};

/*
for initial display of the setup board.
gets the basic image, either blank, or invalid, etc.
*/
function getSpotImageSetup(x, y){
	if (  ( (x==2)||(x==3)||(x==6)||(x==7) ) && ( (y==0)||(y==1) ) ) return imgForbidden;
	if ((y > 1)&&(y < 6)) return imgGreen;
	return imgBlank;
};

/*
When the user has clicked on "Play", this is called to make sure that the user has properly set up his units
*/
function isValidSetup(){
	//Go through the 4 setup rows, make sure each cell is filled.
	for(var i = 2; i < 6; i++){
		for (var j = 0; j < 10; j++){
			if (board[j][i] < 0) return false;
		}
	}
	return true;
};

/*
Removes the play warning
*/
function RemovePlayWarning(){
	if (!isCancelState()){
		lblWarning.innerText = "";
	}
}
