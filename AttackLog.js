/******************************************************
*******************************************************
			AttackLog.js
			
			Used to temporarily display recent
			attacks in game play

*******************************************************
******************************************************/

var attackLogCount = 0; //Stores the number of logs currently displayed
var attackLogMax = 0; //used to determine if there's an overload, so just clear the lblWarning

/*
A new fight occured, display the results
*/
function AddLog(unit1, unit2){
	var unit1Rank = getSoldierRank(getBoardUnit(unit1));
	var unit2Rank = getSoldierRank(getBoardUnit(unit2));
	
	attackLogCount++;
	attackLogMax++;
	if (attackLogMax > 3){
		lblWarning.innertext = "";
		attackLogMax = 1;
	}
	lblWarning.innertext += GetPlayerDisplay(unit1) +" "+ GetRankDisplay(unit1Rank) +" "+ strWordAttacked +" "+ GetPlayerDisplay(unit2) +" "+ GetRankDisplay(unit2Rank) +"\n";
	setTimeout("RemoveLog()", 5000);
};

/*
After a delay, any attack record should be removed.
*/
function RemoveLog(){
	attackLogCount--;
	if (attackLogCount == 0){
		if(!isCancelState()) lblWarning.innertext = "";
		attackLogMax = 0;
	}
};

/*
Get a string display for the fighting units
*/
function GetRankDisplay(rank){
	if (rank ==0) return "S";
	if (rank == 10) return "M";
	if (rank == 11) return "F";
	return rank;
};

function GetPlayerDisplay(unit){
	if (unit > 0) return "Blue";
	return "Red"
}
