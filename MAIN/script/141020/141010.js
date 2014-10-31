$(document).ready(

function () {
    //
    //get button , myMainBody ,myUserInfo , myUserName
    //
    var mySubmit = document.getElementsByName("myButton")[0];
    var myMainBody = document.getElementById("myMainBody");
    var myUserInfo = document.getElementById("myUserInfo");
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
        myCSVFunction();

    }
    //
    //Create myChallengeBoard
    //
    function myChallengeBoardFunction() {
        var myChallengeBoard = document.createElement("div");
        myChallengeBoard.id = "myChallengeBoard";
        //append myChallengeBoard
        myMainBody.appendChild(myChallengeBoard);
        myChallengeBoard.innerHTML = "Pick a Challenge.<br> or load one.<input type='file' id='myCSV'> <br> <div class='inner'>#1</div><div class='inner'>#2</div><div class='inner'>#3</div> <br> <canvas id='canvas1' width='300' height='150'> This text is displayed if your browserdoes not support HTML5 Canvas. </canvas>";
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
            myGameFunction(); 
            myToolsFunction();
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
        myTools.onmouseover = function (e) {
            myTools.style.width = "100px";
            myTools.innerHTML = myToolsString ;
        }
        myMainBody.onmouseover = function (e) {
            myTools.style.width = "100px";
            myTools.innerHTML = myToolsString ;
        }
        myMainBody.onmouseout = function (e) {
            myTools.style.width = "0px";
            myTools.innerHTML = "";
        }
    }
    //
    //myTools String
    //
    var myToolsString = " <input name='myCalculateB' type='submit' value='Calculate'> <br><input name='myButton' type='submit' value='Delete'> <br> <input name='myButton' type='submit' value='Undo'> <br> <input name='myButton' type='submit' value='Redo'> <br> <input name='myButton' type='submit' value='Save'> <br> <input name='myButton' type='submit' value='Stats'> <br> <input name='myButton' type='submit' value='Settings'> <br> <input name='myButton' type='submit' value='Help'> <br>  Area: <br> <input type='text' name='myField' value='0.344' size='12'> <br> Max V.M.Stress <input type='text' name='myField' value='4.233' size='12'> <svg width='100' height='100'><circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' /></svg>";
    //
    //myGame
    //
    function myGameFunction() {
        var myGame = document.createElement("div");
        myGame.id = "myGame";
        //append myChallengeBoard
        myMainBody.appendChild(myGame);
        //get relative location within page
        var position = myGame.getBoundingClientRect();
        var x = position.left;
        var y = position.top;
        //v=create SVG tag
        // var mySVG = document.createElement("svg");
        // mySVG.id = "mySVG";
        // myGame.appendChild(mySVG);
        myGame.innerHTML = "<svg id = 'mySVG'> </svg>";
        var mySVG = document.getElementById("mySVG");
        mySVG.ondblclick = function (e) {
            var posX = e.x -  x ;
            var posY =  e.y - y  ;
            console.log( "x location" , posX );
            console.log(  "y location" , posY );  
            mySVG.innerHTML += "<rect class='draggable'x='" + posX + "' y=  '" + posY + "' width='140' height='40' fill='#000000' />";
        }        
        
    }
    //
    //myCalculateFunction
    //
    function myCalculateFunction (){
    var myCalculateB = document.getElementsByName("myCalculateB")[0];
    //var mySVGs = document.getElementsByClassName("draggable")[0];  
        myCalculateB.onmousedown  = function (e){
        console.log("hi");
        }
    }
    
    
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
        myStatusBar.innerHTML += " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href ='http://jsfiddle.net/draft/'> Log out >> </a> ";
        //append myStatusBar
        myMainBody.appendChild(myStatusBar);
        //log
        console.log(myUserName + " has logged in");
    }
    //
    //Read CSV function
    //
    
    function myCSVFunction (){


        var inputElement = document.getElementById("myCSV");
        inputElement.addEventListener("change",handleFiles, false);

        function handleFiles(e) { 
            var file = e.target.files[0];
            var reader = new FileReader();  
            console.log(file.name);
            reader.addEventListener("load", processfile, false); 
            reader.readAsBinaryString(file);
        }


        function processfile(e){
            var myCSV= e.target.result;
            //console.log(myCSV);
            myArray = $.csv.toArrays(myCSV);
            console.log("hiiiiiiiiiiiiiii");
            console.log(myArray[0][0]);
        }   


    }




});



            // myArray = $.csv.toArrays(file);
            // console.log(myArray);
            // reader.addEventListener("load", processfile, false); 
            // console.log("loaded");