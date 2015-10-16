function RandomSetup(){
	//var items = boardArea.contentItems.toArray();
	boardArea.removeAllContentItems();
	loadUnits(); //setupLoad.js: load units into a player list.  
	
	var tempUnits = getUnits();
	
	for (var i = 0; i < 40; i++){
		board[tempUnits[i].x][tempUnits[i].y-4] = i;
		//alert(tempUnits[i].y*10-40+tempUnits[i].x);
		itemsGlobal[tempUnits[i].y*10-40+tempUnits[i].x].image = imgBlueList[getSoldierRank(i)];
	}
	
	for (var i = 6; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
		//squares[items.length] = "";
	  
			board[j][i] = -1;
			itemsGlobal[i*10 + j].image = imgBlank;
		}
	}
	boardArea.contentFlags = gddContentFlagHaveDetails | gddContentFlagManualLayout;
	boardArea.contentItems = itemsGlobal;
}
