//$(document).ready(

//function () {
    //
    //get button , myMainBody ,myUserInfo , myUserName
    //
    var mySubmit = document.getElementsByName("myButton")[0];
    var myMainBody = document.getElementById("myMainBody");
    var myUserInfo = document.getElementById("myUserInfo");
    var myMatPer, myBucket, myOldPer;
    var myAddFlag = false, myDeleteFlag = false;
    var myNewPer = [3];
    var myBucketValue = 0.0;
    var myOriginalPer = 0.0;
    //
    //when GO! clicked
    //
    mySubmit.onmousedown = function (e) {
        //get userName
        myUserName = document.getElementsByName("myUserName")[0].value;
        //remover myUserInfo
        myUserInfo.parentNode.removeChild(myUserInfo);
        //functions
        myStatusBarFunction();
        myChallengeBoardFunction();
        myTopScoresFunction();
        myIMGFunction();
    }
    //
    //Create myChallengeBoard
    //
    function myChallengeBoardFunction() {
        var myChallengeBoard = document.createElement("div");
        myChallengeBoard.id = "myChallengeBoard";
        //append myChallengeBoard
        myMainBody.appendChild(myChallengeBoard);
        myChallengeBoard.innerHTML = "Pick a Challenge.<br> or load one.<input type='file' id='myCSV'> <br>Upload HERE!<input type='file' id='myUpload'> <br> <div class='inner'>#1</div><div class='inner'>#2</div><div class='inner'>#3</div> <br> <canvasid='canvas1' width='300' height='150'> This text is displayed if your browserdoes not support HTML5 Canvas. </canvas>";
        //Get them to change color
        var myChallenges = document.getElementsByClassName("inner");
        //for (i = 0; i < myChallenges.Length; i++) {
        myChallenges[1].onmouseover = function (e) {
            myChallenges[1].style.backgroundColor = "#d3d3d3";
        }
        myChallenges[1].onmouseout = function (e) {
            myChallenges[1].style.backgroundColor = "#ffffff";
        }
        myChallenges[1].ondblclick = function (e) {
            //remove stuff first x2
            myChallengeBoard.parentNode.removeChild(myChallengeBoard);
            myTopScores.parentNode.removeChild(myTopScores);
            myToolsFunction();
            myGameFunction(); 
            myCalculateFunction();
        }
        // }
    }
    //
    //myTools
    //
    function myToolsFunction() {
        var myTools = document.createElement("div");
        myTools.id = "myTools";
        myMainBody.appendChild(myTools);
        myTools.innerHTML = myToolsString ;
        /*
        myTools.onmouseover = function (e) {
            myTools.style.width = "100px";
            
        }
        myMainBody.onmouseover = function (e) {
            myTools.style.width = "100px";
            myTools.innerHTML = myToolsString ;
        }
        myMainBody.onmouseout = function (e) {
            myTools.style.width = "0px";
            myTools.innerHTML = "";
        }
        */
    }
    //
    //myTools String
    //
    var myToolsString = " <input name='myCalculateB' type='submit' value='Calculate'><br><input name='myAddB' type='submit' value='Add'> <br><input name='myDeleteB' type='submit' value='Delete'> <br> <input name='myButton' type='submit' value='Undo'><br> <input name='myButton' type='submit' value='Redo'> <br> <input name='myShowFEB' type='submit' value='show Elements'> <br><input name='myShowDisp' type='submit' value='show Disp'> <br><inputname='myButton' type='submit' value='Save'> <br> <input name='myButton'type='submit' value='Stats'> <br> <input name='myButton' type='submit' value='Settings'> <br> <input name='myButton' type='submit' value='Help'> <br>  Material %: <br> <input type='text' name='myMatPer' size='12'> <br> Bucket <input type='text' name='myBucket' size='12'> <br> Prompt <input type='text' name='myPrompt' size='20'>";
    //for SVG
    //<svg width='100' height='100'><circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' /></svg>
    //
    //myGame
    //
 
 
    //
    //Create myTopScores
    //
    function myTopScoresFunction() {
        var myTopScores = document.createElement("div");
        myTopScores.id = "myTopScores";
        //append myTopScores
        myMainBody.appendChild(myTopScores);
        //on mouseover
        myTopScores.onmouseover = function (e) {
            myTopScores.style.width = '150px';
            myTopScores.innerHTML = "Top Scores <br> me 1200 <br> her 1000 <br> him 500";
        }
        //onmouseout
        myTopScores.onmouseout = function (e) {
            myTopScores.style.width = '5px';
            myTopScores.innerHTML = "";
        }
    }
    //
    //Create myStatusBar
    //
    function myStatusBarFunction() {
        var myStatusBar = document.createElement("div");
        myStatusBar.id = "myStatusBar";
        myStatusBar.innerHTML = "Logged in as " + myUserName;
        myStatusBar.innerHTML += " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href =''> Log out >> </a> ";
        //append myStatusBar
        myMainBody.appendChild(myStatusBar);
        //log
        console.log(myUserName + " has logged in");
    }


//});

