var isFirstPrint = true; //resolves some sort of output error when first called

/*
Displays an alert by creating a message at the bottom of the gadget
*/
function DisplayWarning(displayText){
	isCancelPrompt = true; //this makes sure that the message isn't reset in a timeout
	lblWarning.innerText = displayText;
};

/*
Prints the turn, and the number of each opposing player onto a label
*/
function printScore(){
	var i;
	//var player;
	if (isFirstPrint){
		isFirstPrint = false;
	}
	else{
		var items = boardArea.contentItems.toArray();
		//boardArea.removeAllContentItems();
		items[101].heading = strTurnLabel + getTotalTurns();
		//boardArea.contentItems = itemsGlobal;
	}
	
	//if (isPlayer1 == 1) player = 0;
	player = 1;
	var labelText = "Enemy\nUnits:\n";
	/*lblScore.innerText = "";
	lblScore.innerText += "T: "+getTotalTurns()+"\n\n"
	
	if(getPlayerTurn() == 1){
		lblScore.innerText += strWait+"\n";
	}
	else{
		lblScore.innerText += strGo+"\n";
	}*/
	
	labelText += "S: " + getNumUnitsByRank(player, 0) +"\n";
	for (i = 1; i < 10; i++){
		labelText += i +": " + getNumUnitsByRank(player, i) +"\n";
	}
	labelText += "M: " + getNumUnitsByRank(player, 10) +"\n";
	
	lblScore.innerText = labelText;
	
	/*lblScore.innerText += "Blue\n"
	lblScore.innerText += "S: " + getNumUnitsByRank(0, 0) +"\n";
	for (i = 1; i < 10; i++){
		lblScore.innerText += i +": " + getNumUnitsByRank(0, i) +"\n";
	}
	lblScore.innerText += "M: " + getNumUnitsByRank(0, 10) +"\n";*/
};

/*
Called for printing the score, 
figures out how many units of a particular rank,
for a particular player, are still alive
*/
function getNumUnitsByRank(player, rank){
	var units;
	if (player == 0) units = Units[0];
	else units = Units[1];
	var total = 0;
	switch (rank){
		case 0:
			
				if (units[0].isAlive) return 1;
				return 0;
			
		case 1:
			
				if (units[1].isAlive) return 1;
				return 0;
			
		case 2:
			
				if (units[2].isAlive) return 1;
				return 0;
			
		case 3:
			
				if (units[3].isAlive) total += 1;
				if (units[4].isAlive) total += 1;
			return total;
		case 4:
			
				if (units[5].isAlive) total += 1;
				if (units[6].isAlive) total += 1;
				if (units[7].isAlive) total += 1;
			return total;
		case 5:
			
				if (units[8].isAlive) total += 1;
				if (units[9].isAlive) total += 1;
				if (units[10].isAlive) total += 1;
				if (units[11].isAlive) total += 1;
				return total;
			
		case 6:
			
				if (units[12].isAlive) total += 1;
				if (units[13].isAlive) total += 1;
				if (units[14].isAlive) total += 1;
				if (units[15].isAlive) total += 1;
				return total;
			
		case 7:
			
				if (units[16].isAlive) total += 1;
				if (units[17].isAlive) total += 1;
				if (units[18].isAlive) total += 1;
				if (units[19].isAlive) total += 1;
				return total;
			
		case 8:
			
				if (units[20].isAlive) total += 1;
				if (units[21].isAlive) total += 1;
				if (units[22].isAlive) total += 1;
				if (units[23].isAlive) total += 1;
				if (units[24].isAlive) total += 1;
				return total;
			
		case 9:
			
				if (units[25].isAlive) total += 1;
				if (units[26].isAlive) total += 1;
				if (units[27].isAlive) total += 1;
				if (units[28].isAlive) total += 1;
				if (units[29].isAlive) total += 1;
				if (units[30].isAlive) total += 1;
				if (units[31].isAlive) total += 1;
				if (units[32].isAlive) total += 1;
				return total;
			
		case 10:
			
				if (units[33].isAlive) total += 1;
				if (units[34].isAlive) total += 1;
				if (units[35].isAlive) total += 1;
				if (units[36].isAlive) total += 1;
				if (units[37].isAlive) total += 1;
				if (units[38].isAlive) total += 1;
				return total;
			
			//should never get here
	}
}
