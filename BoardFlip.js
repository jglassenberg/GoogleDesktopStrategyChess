/*************
TODO: try to remove the need for this variable
***************/
var isFlipped = false;
var canFlip = false;

plugin.onAddCustomMenuItems = menuAddItems;
//var menu;
//This variable should either be in AIDifficulty, or in menu.js
//var mnuDifficulty;


function menuAddItems(menu) {
	//SetItemStyle(item_text, style)
	
	menu.AddItem(strMenuFlip,0,OnMenuFlip);
	
	/*//This is for AI difficulty
	mnuDifficulty = menu.AddPopup(strDIfficulty);
	mnuDifficulty.AddItem(strAIEasy,0,OnAIEasy);
	mnuDifficulty.AddItem(strAIMedium,gddMenuItemFlagChecked,OnAIMedium);
	mnuDifficulty.AddItem(strAIHard,0,OnAIHard);
	mnuDifficulty.AddItem(strAIBrutal,0,OnAIBrutal);*/
	
};

/*function AddMenuFlip(){
	menu.AddItem(strMenuFlip,gddMenuItemFlagGrayed,OnMenuFlip);
}

function EnableMenuFlip(){
	menu.SetItemStyle(strMenuFlip, null); 
}

function DisableMenuFlip(){
	menu.SetItemStyle(strMenuFlip, gddMenuItemFlagGrayed);
	isFlipped = false;
}*/

function OnMenuFlip(){
	FlipBoard();
	/*if (isFlipped)
		menu.SetItemStyle(strMenuFlip, gddMenuItemFlagChecked); 
 	else
		menu.SetItemStyle(strMenuFlip, null);*/
};
/*
Called when user selects this item from the menu
Flips the board 180 deg, so that user sees from opposite perspective
*/

function FlipBoard(){

	if (!isPlaying) return; 
	var x;
	var y;
	
	//var items = boardArea.contentItems.toArray();
	boardArea.removeAllContentItems();
	if (isFlipped){
		for(var i = 0; i < 100; i++){
			x = i%10;
			y = Math.floor(i / 10);
			itemsGlobal[i].setRect((x)*blocksize, (y)*blocksize+textheight, blocksize, blocksize);
		}
		isFlipped = false;
	}
	else{
		for(var i = 0; i < 100; i++){
			x = i%10;
			y = Math.floor(i / 10);
			itemsGlobal[i].setRect((9-x)*blocksize, (9-y)*blocksize+textheight, blocksize, blocksize);
		}
		isFlipped = true;
	}
	
	boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	boardArea.contentItems = itemsGlobal;
};

function GetCanFlip(){
	return canFlip;
};

function EnableFlip(){
	canFlip = true;
};

function DisableFlip(){
	canFlip = false;
	isFlipped = false;
}
