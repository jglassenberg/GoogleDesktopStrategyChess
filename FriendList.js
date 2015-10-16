var curpos;
var listLength=4;
var friends_with_sidebar;
function DisplayFriendLoadWait()
{
  boardArea.removeAllContentItems();
  boardArea.contentFlags=gddContentFlagHaveDetails;
  AddButtonAuto(strCancel,OnCancelNotify);
  AddLabelAuto(strFindingFriends)
};
  function DrawFriends()
  {
    DisplayFriendLoadWait();
    var friends=googleTalk.friends.toArray();
    friends_with_sidebar=new Array();
    for(var i=0;i<friends.length;i++)
    {
      if(friends[i].has_sidebar)
        friends_with_sidebar.push(friends[i])
    }
    if(!friends_with_sidebar.length)
    {
      boardArea.removeAllContentItems();
      boardArea.contentFlags=gddContentFlagHaveDetails;
      AddButtonTextImgAuto(strGoToMainMenu,imgBlueList[10],OnCancelNotify);
      AddLabelAuto(strNoFriendsOnline);
      AddImageAuto(imgMain);
      return
    }
    boardArea.removeAllContentItems();
    boardArea.contentFlags=gddContentFlagHaveDetails;
    MakeFirstList()
  };
  function MakeFirstList()
  {
    curpos=0;
    MakeFriendList()
  };
  function OnNext(item)
  {
    MakeFriendList()
  };
  function OnPrev(item)
  {
    curpos-=listLength*2;
    MakeFriendList()
  };
  function MakeFriendList()
  {
    boardArea.removeAllContentItems();
    boardArea.contentFlags=gddContentFlagHaveDetails;
    if(curpos+listLength<friends_with_sidebar.length)
      AddButtonAuto("next",OnNext);
    for(var i=curpos;i<Math.min(friends_with_sidebar.length,curpos+listLength);i++)
    {
      var icon;
      if(friends_with_sidebar[i].status==gddFriendStatusOnline)
      {
        icon=imgBlueList[0]
      }
      else if(friends_with_sidebar[i].status==gddFriendStatusBusy)
      {
        icon=imgGreen
      }
      else
      {
        icon=imgBlueList[12]
      }
      AddButtonTextImgAuto(friends_with_sidebar[i].name,icon,OnStartMultiPlayer,friends_with_sidebar[i].user_id)
    }
    if(curpos>0)
      AddButtonAuto("prev",OnPrev);
    curpos+=listLength;
    AddButtonTextImgAuto(strGoToMainMenu,imgBlueList[10],OnCancelNotify);
    AddImageAuto(imgMainSmall)
  }
