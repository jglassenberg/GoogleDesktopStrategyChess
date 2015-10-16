/******************************
		Image variables
******************************/
var imgBlueList; //stores the images related to blue units
var imgRedList; //stores the images related to red units
var imgBlank; //stores the image related to an empty spot
var imgForbidden; //stores the image for a forbidden spot
var imgGreen;

var imgBlueListS; //stores the images for a blue unit when it is selected
var imgRedListS; //stores the images for a red unit when it is selected

var imgSinglePlay;
var imgMultiPlay;
var imgMain;
var imgMainSmall;

/***************************************************************************
		Image loading functions
************************************************************************/

/*
Loads all the necessary images
*/
function loadImages(){
	imgBlueList = new Array(12); //get ready to set the unit images
	imgRedList = new Array(13);
	var blueHeader = "board_images/B_";
	var redHeader = "board_images/R_";
	
	//load spy images
	imgBlueList[0] = graphics.loadImage(blueHeader+"S.gif");
	imgRedList[0] = graphics.loadImage(redHeader+"S.gif");
	
	//numerical images
	for (var i = 1; i < 10; i++){
		imgBlueList[i] = graphics.loadImage(blueHeader+i+".gif");
		imgRedList[i] = graphics.loadImage(redHeader+i+".gif");
	}
	//Mines
	imgBlueList[10] = graphics.loadImage(blueHeader+"M.gif");
	imgRedList[10] = graphics.loadImage(redHeader+"M.gif");
	//Flags
	imgBlueList[11] = graphics.loadImage(blueHeader+"F.gif");
	imgRedList[11] = graphics.loadImage(redHeader+"F.gif");
	//"?" symbols
	imgBlueList[12] = graphics.loadImage(blueHeader+"Q.gif");
	imgRedList[12] = graphics.loadImage(redHeader+"Q.gif");

	//Other images
	imgBlank = graphics.loadImage("board_images/Blank.gif");
	imgForbidden = graphics.loadImage("board_images/No.gif");
	imgGreen = graphics.loadImage("board_images/Green.gif");
	
	imgSinglePlay = graphics.loadImage("board_images/SinglePlay.gif");
	imgMultiPlay = graphics.loadImage("board_images/MultiPlay.gif");
	imgMain = graphics.loadImage("board_images/StrategyChess.gif");
	imgMainSmall = graphics.loadImage("board_images/StrategyChessSmall.gif");

	loadImagesSelected();
};

/*
Loads images for the board units when they are selected
*/
function loadImagesSelected(){
	imgBlueListS = new Array(12); //everything except for the "?", as this is never seen for own units
	imgRedListS = new Array(13); //all opponents units, including the "?".  This is usually just used when the game is over
	var blueHeader = "board_images/B_";
	var redHeader = "board_images/R_";
	
	//load spy images
	imgBlueListS[0] = graphics.loadImage(blueHeader+"Sc.gif");
	imgRedListS[0] = graphics.loadImage(redHeader+"Sc.gif");
	//numerical images
	for (var i = 1; i < 10; i++){
		imgBlueListS[i] = graphics.loadImage(blueHeader+i+"c.gif");
		imgRedListS[i] = graphics.loadImage(redHeader+i+"c.gif");
	}
	//Mines
	imgBlueListS[10] = graphics.loadImage(blueHeader+"Mc.gif");
	imgRedListS[10] = graphics.loadImage(redHeader+"Mc.gif");
	//Flags
	imgBlueListS[11] = graphics.loadImage(blueHeader+"Fc.gif");
	imgRedListS[11] = graphics.loadImage(redHeader+"Fc.gif");
	//"?" symbols
	//imgBlueListS[12] = graphics.loadImage(blueHeader+"Qc.gif");
	imgRedListS[12] = graphics.loadImage(redHeader+"Qc.gif");
}
