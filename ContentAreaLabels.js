/*********************************************************************
***********************************************************************
					ContentAreaLabels.js

	These functions are for creating labels and buttons in the content area
					
*********************************************************************
**********************************************************************/

/*
Main item inserter
*/
function AddItemGeneral(heading, img, OnDetailsView, snippet, x, y, length, height ){
  var label = new ContentItem();
  label.flags = gddContentItemFlagNoRemove;
  if (snippet != null) label.snippet = snippet;
  if (heading != null) label.heading = heading;
  if (img != null) label.image = img;
  if (OnDetailsView != null) label.onDetailsView = OnDetailsView;
  else label.flags = gddContentItemFlagStatic|gddContentItemFlagNoRemove;
  if (height != null) label.SetRect(x, y, length, height);
  else if (length != null) label.SetRect(x, y, length, textheight);
  boardArea.addContentItem(label, gddItemDisplayInSidebar);
};
/*
Creates a label item when the content Area is set to manual layout
*/
function AddLabelManual(x, y, length, heading){
  AddItemGeneral(heading, null, null, null, x, y, length);
};

/*
Creates a label item when the content Area is not set to manual layout
*/
function AddLabelAuto(heading){
  AddItemGeneral(heading);
};

/*
Creates a button item when the content Area is set to manual layout
*/
function AddButtonManual(x, y, length, heading, onDetailsView){
  AddItemGeneral(heading, null, onDetailsView, null, x, y, length);
};


/*
Creates a button item when the content Area is not set to manual layout
*/
function AddButtonAuto(heading, onDetailsView, snip){
  AddItemGeneral(heading, null, onDetailsView, snip);
};

/*
Creates a button item when the content Area is not set to manual layout
*/
function AddButtonTextImgAuto(heading, img, onDetailsView, snip){
  AddItemGeneral(heading, img, onDetailsView, snip);
};

function AddButtonImgManual(img, onDetailsView, snip, x, y, length, height ){
	AddItemGeneral(null, img, onDetailsView, snip,x,y,length,height);
}  ;

/*
Adds the image to the contentItem in manual layout
*/
/*function AddMainImageManual(x,y, length){
    var mainItem = new ContentItem();
    mainItem.flags = gddContentItemFlagStatic;
    mainItem.image = imgMain;
    mainItem.SetRect(x, y, length, textheight);
    boardArea.addContentItem(button, gddItemDisplayInSidebar);
}*/

/*
Adds the image to the contentItem in non-manual layout
*/
function AddImageAuto(img){
    AddItemGeneral(null, img);
};

function AddImageManual(img, x, y, length, height){
    AddItemGeneral(null, img, null, null, x,y,length, height);
};
/***********************************************************
	Returns items for adding to contentItem
**********************************************************/

/*
Gets a label item when the content Area is set to manual layout
*/
function GetLabelManual(x, y, length, heading){
  var label = new ContentItem();
  label.snippet = "";
  label.heading = heading;
  label.flags = gddContentItemFlagStatic;
  label.SetRect(x, y, length, textheight);
  return label;
};

/*
Gets a label item when the content Area is not set to manual layout
*/
function GetLabelAuto(heading){
  var label = new ContentItem();
  label.snippet = "";
  label.heading = heading;
  label.flags = gddContentItemFlagStatic;
  //label.SetRect(0, 0, 10, textheight);
  return label;
};

/*
Gets a button item when the content Area is set to manual layout
*/
function GetButtonManual(x, y, length, heading, onDetailsView){
  var button = new ContentItem();
  button.snippet = "";
  //button.image = imgBlueList[10];
  button.heading = heading; 
  button.onDetailsView = onDetailsView;
  button.flags = gddContentItemFlagNoRemove;
  button.SetRect(x, y, length, textheight);
  return button;
};

/*
Gets a button item when the content Area is not set to manual layout
*/
function GetButtonAuto(heading, onDetailsView){
  var button = new ContentItem();
  button.snippet = "";
  button.heading = heading;
  button.onDetailsView = onDetailsView;
  button.flags = gddContentItemFlagNoRemove;
 // button.SetRect(0, 0, 10, textheight);
  return button;
}
