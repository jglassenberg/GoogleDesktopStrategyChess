/**********************************************************
			Data initialization
*********************************************************/
/*
initializes the board before users start placing their pieces
*/
function setupBoard(){
	var i;
	var j;
        matrixSize = 10;
	board = new Array(matrixSize);
	for (i=0; i < matrixSize; i++)
	{
		board[i] = new Array(matrixSize);
		for (j=0; j < matrixSize; j++)
		{
			board[i][j] = 0;                      
		}
	} 
};
/********************************************************************
			Utility functions
**********************************************************************/
/*
The board is 10x10, and has 2 regions that are off limits.  
This function determines if a given location is a valid place to move a unit
*/
function isValidSpot(x, y){
    //Verify that the values lie within the board
    if ( (x<0)||(x>9)||(y<0)||(y>9))
    {
	return 0;
    }
    //The following condition checks for invalid location. 
    if (  ( (x==2)||(x==3)||(x==6)||(x==7) ) && ( (y==4)||(y==5) ) )
    {
	return 0;
    }
    //Otherwise, this location is a valid location on the map.
    return 1;
};

/*
input: a unit from the board
output: the number of a unit in the player list
*/
function getBoardUnit(unitVal){
	if (unitVal > 0) return unitVal-1;
	return -1-unitVal;
};

/*
input: a unit from the board
output: the unit related to that value
*/
function getUnitInfo(unitVal){
	//if (isSinglePlay){
		if (unitVal > 0) return Units[0][unitVal-1];
		return Units[1][-1-unitVal];
	//}
	//else
	/*if (unitVal > 0){
		if(isPlayer1) return myUnits[unitVal-1];
		return Units[1][unitVal-1];
	}
	//else
	if(isPlayer1) return myUnits[-1-unitVal];
	return Units[1][-1-unitVal];*/
	
};

/*
Returns 0 if units are equal, 
-2 if unit1 captured the flag, 
2 if unit2 captured the flag,
-1 if unit1 destroyed unit2
1 if unit2 destroyed unit1
*/
function decideWinner(unitAttack, unitDefense)
{
	var unit1Rank = getSoldierRank(unitAttack);
	var unit2Rank = getSoldierRank(unitDefense);
	
	//End Case: The flag was captured!
	if (unit1Rank==11) return 2;
	if (unit2Rank==11) return -2;

	//Case 1: units are the same.  Both die
	if (unit1Rank == unit2Rank)
	{
		return 0;
	}
	//Case 2: Special case involving a spy
	if (unit1Rank==0)
	{
		if (unit2Rank==1) return -1;
		return 1;
	}
	if (unit2Rank==0)
	{
		//if (unit1Rank==1) return 1;
		return -1; //when a spy is attacked, it loses no matter what
	}
	//Case 4: Special case involving a mine
	if (unit1Rank == 10)
	{
		//winner decided based on whether opponent is a miner (8)
		if (unit2Rank == 8) return 1;
		return -1;
	}
	if (unit2Rank == 10 )
	{
		//winner decided based on whether opponent is a miner (8)
		if (unit1Rank == 8) return -1;
		return 1;
	}

	
	//Case 6: Remaining cases, outcome determined by rank.
	if (unit1Rank < unit2Rank) return -1;
	return 1;
}
