/********************************
Cancel variables
********************************/
//var cancelButtonNum = 101
var isCancelPrompt = false;

/******************************8
	For handling cancel duering setup
**********************************/
/*
Called when user clicks on "Cancel" during setup
*/
function OnSetupCancel(item){
	var items = boardArea.contentItems.toArray();
	//convert "play" button to "Yes" button
	items[100].heading = strYes;
	items[100].onDetailsView = OnCancelConfirmed;
	items[101].heading = strNo;
	items[101].onDetailsView = OnReturnSetup;

	items[102].heading = "";
	items[102].setRect(0,0,0,0);

	isCancelPrompt = true;
	lblWarning.innerText = strCancelConfirm;
};

function OnCancelConfirmed(item){
	lblWarning.innerText = "";
	isCancelPrompt = false;
	OnCancelNotify(item);
};
/*
Called when user clicks "No" to cancel in setup
*/
function OnReturnSetup(item){
	var items = boardArea.contentItems.toArray();
	//convert "play" button to "Yes" button
	items[100].heading = strPlay;
	items[100].onDetailsView = OnPlayNotify;
	items[101].heading = strCancel;
	items[101].onDetailsView = OnSetupCancel;

	items[102].heading = strRandomSet;
	items[102].setRect(23, 11*blocksize+textheight-3, 68, textheight);

	lblWarning.innerText = "";
	isCancelPrompt = false;
};

/********************************************
	For exiting gameplay
*********************************************/

/*
Called when the user clicks on a Quit Game button
*/
function OnQuitNotify(item){
  //if the game is over, just quit. otherwise, confirm with user
  if(isGameOver()){
	lblScore.innerText = "";
	boardArea.contentFlags = gddContentFlagHaveDetails;
	DisplayMainMenu();
  }
  else {
	var items = boardArea.contentItems.toArray();
	//convert "play" button to "Yes" button
	items[100].heading = strYes;
	items[100].onDetailsView = OnQuitConfirmed;
	items[103].heading = strNo;
	//items[103].onDetailsView = OnReturnGame;
	items[103].setRect(90, 10*blocksize+textheight, 40, textheight);

	isCancelPrompt = true;
	lblWarning.innerText = strQuitConfirm;
  }


};

function OnQuitConfirmed(){
	if (!isSinglePlay){
		//todo: figure out how to create a message box with Yes and No
		//alert(strQuitter);
		try {
			googleTalk.SendTalkData(friend_user_id, msgForfeit);
		} catch (e) {
		}
	}	
	lblScore.innerText = "";
	lblWarning.innerText = "";
	isCancelPrompt = false;
	boardArea.contentFlags = gddContentFlagHaveDetails;
	DisplayMainMenu();
};

function OnReturnGame(item){
	var items = boardArea.contentItems.toArray();
	//convert "play" button to "Yes" button
	items[100].heading = strQuit;
	items[100].onDetailsView = OnQuitNotify;
	items[103].heading = "";
	items[103].setRect(0, 0, 0, 0);

	lblWarning.innerText = "";
	isCancelPrompt = false;
};

/***********************************
	Multiplayer game notices
*************************************/

/*
Called when the user finished setup, and cancels game while waiting for opponent to get ready
*/
function OnWaitCancel(item){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails| gddContentFlagManualLayout;
  
  AddButtonManual(0, textheight+10, 80, strYes, OnCancelNotify);
  AddButtonManual(80, textheight+10, 80, strNo, OnReturnToWait);
  AddImageAuto(imgMainSmall);
  lblWarning.innerText = strCancelConfirm;

};

/*
Called when user decided not to cancel game, while waiting for friend
*/
function OnReturnToWait(item){
	lblWarning.innerText = "";
	DisplayFriendWait();
};

/*
Called when user receives a Deny notice  
*/
function AlertDecline(user_name){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;//| gddContentFlagManualLayout;
  
  AddButtonAuto(strOK, OnBackToFriends);
  AddLabelAuto(strDecline);
  AddLabelAuto(user_name);  
  AddImageAuto(imgMainSmall);

};

/*
Called when user receives a Cant notice (wanted to play with someone who is already in a game)
*/
function AlertCant(user_name){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;//| gddContentFlagManualLayout;
  
  AddButtonAuto(strOK, OnBackToFriends);
  AddLabelAuto(strCant2);
  AddLabelAuto(strCant1); 
  AddLabelAuto(user_name); 
  AddImageAuto(imgMainSmall);

};

/*
Called when user receives a reject notice  
*/
function AlertReject(user_name){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;
  
  AddButtonAuto(strOK, OnBackToMain);
  AddLabelAuto(strReject2);
  AddLabelAuto(strReject1); 
  AddImageAuto(imgMainSmall); 
  
};

/*
Called when user receives a Cancel notice (opponent cancelled during setup)  
*/
function AlertCancel(user_name){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;//| gddContentFlagManualLayout;
  
  AddButtonAuto(strOK, OnBackToMain);
  AddLabelAuto(strFriendCancelled);
  AddLabelAuto(user_name);  
  AddImageAuto(imgMainSmall);

};

/*
This sends the user back to the list of online friends
*/
function OnBackToFriends(item){
	lblWarning.innerText = "";
	friend_user_id = "";
	DrawFriends();
};

/*
Sends the user back to the main menu
*/
function OnBackToMain(item){
	//lblWarning.innerText = "";
	//friend_user_id = "";
	DisplayMainMenu();
};

/*
Multiplayer: end game messages
*/
function AlertEndGame(user_name, strReason){
	isCancelPrompt = true;
	lblWarning.innerText = user_name + " " + strReason;
	setGameOver(1);
        DisplayEndBoard();
};


/********************************
Common cancel operations
********************************/

/*
Called when the cancel button is clicked.  Calls regular cancel, but first prompts user to confirm
*/
function OnCancelNotifyConfirm(item) {
  if(confirm(strCancelConfirm)){
	OnCancelNotify(item);
  }
};

/*
Called when the cancel button is clicked
*/
function OnCancelNotify(item) {
  //if this is called when a friend is connected, let him know game is cancelled
  if ((!isSinglePlay)&&(friend_user_id != "")){
	try {
        googleTalk.SendTalkData(friend_user_id, msgCancel);
      } catch (e) {
		//hopefully it never gets here
      }
  }
  friend_user_id = "";
  //boardArea.contentFlags = gddContentFlagHaveDetails;
  DisplayMainMenu();
};
/*******************************
	Utility functions
*********************************/

function isCancelState(){
	return isCancelPrompt;
}
