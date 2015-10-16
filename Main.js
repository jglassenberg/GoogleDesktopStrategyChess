var board; //this is a 2 dimensional array to represent the game board
var matrixSize; //Stratego games are to be played in 10x10 boards, this should always be initialized to 10
//var myUnits; //An array of the units stored by player1 (person)
//var hisUnits; //An array of the units stored by the computer player
var Units; //stores the list of units for all players
var isSinglePlay = true;
var isPlayer1 = true;

var isPlaying = false;

/*
This runs at program startup
*/
function view_onOpen(){
	
	setupBoard();
	loadImages();
	boardArea.maxContentItems= 150;
	//AddMenuFlip();
	//boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	//boardArea.contentFlags = gddContentFlagHaveDetails;
	DisplayMainMenu();

};


/**********************************************************
			Data initialization
*********************************************************/

/*
After images are loaded and a setup is loaded, computer can take the setup values here
*/
function setupComputerPlayer(playerUnits){
	//alert(playerUnits);
	Units[1] = new Array(40);
	for (var i = 0; i < 40; i++){
		Units[1][i] = new soldier(playerUnits[i].value);
		Units[1][i].setSoldierLocation(playerUnits[i].x,playerUnits[i].y);
		board[Units[1][i].x][Units[1][i].y] = -Units[1][i].value -1;
	}
};

function restart(){
	//multiplayer
	friend_user_id = "";
	isReady = false;
	isFriendReady = false;
	hasSentUnits = false;
	numReceivedUnits = 0;
	
	//main
	isSinglePlay = true;
	isPlayer1 = true;
	isPlaying = false;
	
	//turn
	totalTurns = 0;
	playerTurn = 0; //0 means positive (blue), 1 negative (red)
	gameOver = false;
	//canResetImg = false;
	
	//setupPage
	isWaiting = false;
	
	//displayTurn
	isUnitSelected = false;
	
	//ScoreDisplay
	isFirstPrint = true;
	
	lblScore.innerText = "";
	
	//BoardFlip
	DisableFlip(); //user cannot flip board items at this point
	//DisableMenuFlip();

	//CancelHandler
	isCancelPrompt = false;
	lblWarning.innerText = "";
};
/***********************************************************************
		Display functions
***********************************************************************/
function DisplayMainMenu(){

  restart(); //reset any variables that may have been changed during play
  boardArea.removeAllContentItems(); 
  boardArea.contentFlags = gddContentFlagHaveDetails| gddContentFlagManualLayout;
 

  AddButtonImgManual(imgSinglePlay, OnSinglePlay, null, 35, 85, 105, 35 );
  AddButtonImgManual(imgMultiPlay, OnMultiPlay, null, 35, 125, 105, 35 );
 
  AddImageManual(imgMain, 35, 0, 105, 65);
  
};

/***************************************************************
	Event handlers
*************************************************************/


/*
Called when the single player button is clicked
*/
function OnSinglePlay(item){
	//alert("You chose single player mode");
	isSinglePlay = true;
	isPlaying = true;
	Units = new Array(2);
	DisplayAskForDifficulty();
	//boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	//drawSetupPage();
};

/*
Called when the multi player button is clicked
*/
function OnMultiPlay(item){
	//alert("You chose multi player mode");
	isSinglePlay = false;
	Units = new Array(2);
	DrawFriends();
}
