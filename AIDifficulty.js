/*****************************
	Difficulty Settings for the AI
*****************************/

/**************************
	Global Variables
***************************/
//difficultyLevel defines the leveel of difficulty that the AI is supposed to play
//0 means easiest, 4 hardest.  1 is normal (non-cheating)
var difficultyLevel;

/*********************
User prompt functions
*********************/

function DisplayAskForDifficulty(){
  boardArea.removeAllContentItems();
  boardArea.contentFlags = gddContentFlagHaveDetails;//| gddContentFlagManualLayout;
  
  AddButtonTextImgAuto(strGoToMainMenu,imgBlueList[10], OnBackToMain);
  AddLabelAuto(""); 
  AddButtonTextImgAuto(strAIBrutal,imgBlueList[1], OnAIBrutal);
  AddButtonTextImgAuto(strAIHard,imgBlueList[3], OnAIHard);
  AddButtonTextImgAuto(strAIMedium, imgBlueList[5], OnAIMedium);
  AddButtonTextImgAuto(strAIEasy,imgBlueList[9], OnAIEasy);
  AddLabelAuto(strDifficulty);  
  AddImageAuto(imgMainSmall);
};

/**********************************
	Event Handlers
***********************************/

function OnAIEasy(item){
	difficultyLevel = 0;
	drawSetupPage();
};

function OnAIMedium(item){
	difficultyLevel = 1;
	drawSetupPage();
};

function OnAIHard(item){
	difficultyLevel = 2;
	drawSetupPage();
};

function OnAIBrutal(item){
	difficultyLevel = 3;
	drawSetupPage();
};

/**********************************
Difficulty setting handlers
*********************************/

/*
Called at start of single player mode.
Sets visibility properties for some difficulty leveles
On hard, AI knows of mines and a few good units
On brutal, AI knows of all unit locations
*/
function SetMyVisibility(){
	if (difficultyLevel == 2){ //hard
		//AI will see all opponent mines and flag
		for (var i = 33; i < 40; i++){
			Units[0][i].isKnown = 1;
		}
		Units[0][0].isKnown = 1; //spy location is known
		Units[0][1].isKnown = 1; //1 location is known
		Units[0][39].isKnown = 1; //flag location is known
	}
	else if (difficultyLevel == 3){ //brutal
		//AI will see all opponent units
		for (var i = 0; i < 40; i++){
			Units[0][i].isKnown = 1;
		}
	}
};

/*
Called after each computer turn
Randomly forgets some visible units
*/
function ForgetUnitRanks(){
	if (difficultyLevel > 0) return;
	if ( Math.floor(Math.random() * 5) == 0 ){
		//AI will see all opponent units
		for (var i = 0; i < 40; i++){
			if( (Units[0][i].isKnown) && (Math.floor(Math.random()*2) == 0 ) ){
				Units[0][i].isKnown = 0;
				Units[0][i].hasMoved = 0;
			}
		}
	}

};

/******************************************
Helper Functions
*********************************************/

/*
Used by AI in deciding moves
Lets AI know if a particular unit can still be destroyed
*/
/*function HasLivingThreats(unitval){

}*/

/*
Used by AI in deciding moves
Lets AI know if a particular unit can still be destroyed by an unknown threat
Note: this does not count units of equal value
*/
function HasUnknownThreats(unitval){
	if (unitval == 0) return true;
	if ((unitval == 1) && (!Units[0][0].isKnown)) return true;
	for (var i = 1; i <= getRankListNum(unitval-1); i++){
		if (!Units[0][i].isKnown) return true;
	}
	//all lower numbers safe, but must also test for mines
	if (unitval == 8) return false;
	if (difficultyLevel > 1) return false;
	for (var i = 33; i < 39; i++){
		if (!Units[0][i].isKnown) return true;
	}
	return false;
};

/*
Returns the last number of this soldier, based on its rank
*/
function getRankListNum(value){
	if (value == 0) return 0; //spy
	if (value == 1) return 1; //general, 1
	if (value == 2) return 2; //2
	if (value == 3) return 4; //3
	if (value == 4) return 7; //4
	if (value == 5) return 11; //5
	if (value == 6) return 15; //6
	if (value == 7) return 19; //7
	if (value == 8) return 24; //8
	if (value == 9) return 32; //9	
}
