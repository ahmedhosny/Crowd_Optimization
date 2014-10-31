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
    var myToolsString = " <input name='myCalculateB' type='submit' value='Calculate'><br><input name='myAddB' type='submit' value='Add'> <br><input name='myDeleteB' type='submit' value='Delete'> <br> <input name='myButton' type='submit' value='Undo'><br> <input name='myButton' type='submit' value='Redo'> <br> <input name='myShowFEB' type='submit' value='show Elements'> <br><inputname='myButton' type='submit' value='Save'> <br> <input name='myButton'type='submit' value='Stats'> <br> <input name='myButton' type='submit' value='Settings'> <br> <input name='myButton' type='submit' value='Help'> <br>  Material %: <br> <input type='text' name='myMatPer' size='12'> <br> Bucket <input type='text' name='myBucket' size='12'> <br> Prompt <input type='text' name='myPrompt' size='20'>";
    //for SVG
    //<svg width='100' height='100'><circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' /></svg>
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
        myGame.innerHTML = "<canvas id='myCanvas'> </canvas>";
        var myCanvas = new fabric.Canvas("myCanvas",{
            width: 300,
            height: 300 ,
            isDrawingMode: true
             });

        //Brush size
        myCanvas.freeDrawingBrush.width = 20;

        //Delete button - white
        var myDeleteB = document.getElementsByName("myDeleteB")[0];
        myDeleteB.onmousedown = function(e){
            myDeleteFlag = true;
            myAddFlag = false;
            myCanvas.freeDrawingBrush.color = "#ffffff";  
        }
        //Delete button - white
        var myAddB = document.getElementsByName("myAddB")[0];
        myAddB.onmousedown = function(e){
            myAddFlag = true;
            myDeleteFlag = false;
            myCanvas.freeDrawingBrush.color = "#000000";  
        }
        //show elements
        myShowFEB = document.getElementsByName("myShowFEB")[0];
        myShowFEB.onmousedown = function(e){
            drawFEFunc(myCanvas,30,30,true);
        }
        myShowFEB.onmouseup = function (e){
            drawFEFunc(myCanvas,30,30,false);
        }

        //Pixel specific
        var myDataLength = myCanvas.width * myCanvas.height;
        myMatPer = document.getElementsByName("myMatPer")[0];
        myBucket = document.getElementsByName("myBucket")[0];
        myPrompt = document.getElementsByName("myPrompt")[0];

        myBucket.value = 0.0;
        //put initial guess to canvas
        fabric.Image.fromURL(myImageURL, function(img) {
            img.set({width: myCanvas.width, height: myCanvas.height, originX: 'left', originY: 'top'});
            myCanvas.setBackgroundImage(img, myCanvas.renderAll.bind(myCanvas));
            getMatFunc(myCanvas);
            //record original here
            myOriginalPer = myMatPer.value;
        });
        myCanvas.freeDrawingBrush.width = 20;
        //myCanvas.on('mouse:down', function(options) {
        //    console.log(options.e.clientX, options.e.clientY);
        //});
        myCanvas.on('mouse:move', function(options) {
            //get material %
            getMatFunc(myCanvas); 
            //initial condition.. bucket is empty
            if(myBucket.value == 0 & myDeleteFlag==false & myAddFlag==false ){
                myCanvas.freeDrawingBrush.width = 0;
                myPrompt.value = "bucket is empty!";
            }
            //user starts to delete or add stuff
            else if(myDeleteFlag==true & myAddFlag==false) {
                myCanvas.freeDrawingBrush.width = 20;
                console.log("deleting material");
                myPrompt.value = "delete material";
            }
            //myAddFlag == true 
            else if (myAddFlag==true & myDeleteFlag==false & myBucket.value > 0 ){
                myCanvas.freeDrawingBrush.width = 20;
                console.log("adding material");
                myPrompt.value = "add material";
            }
            else if (myBucket.value < 0){
                myCanvas.freeDrawingBrush.width = 0;
                myPrompt.value = "bucket is empty!";
            }
        });

        myCanvas.on('mouse:down', function(options) {
            //get value at mouse down
            myOldPer = myMatPer.value;
        });

        Object.observe(myNewPer,myCalcFunc);
        function myCalcFunc(changes){
            //get value
            var val = myNewPer[0] - myOldPer;
            //if it is minus i.e. we are deleting material
           if (  val < 0 ){
            myBucketValue += (val*-1);
           }
           //else if zero or posotive i.e. we are adding material
           else if ( val > 0 ) {
                myBucketValue -= val;
           }
           myBucket.value = myBucketValue.toFixed(2);
          // if (myBucketValue < 0){
           //     myAddFlag = false;
           //     myPrompt.value = "bucket is empty!";
          //      console.log("exceeded");
          // }
        }

        
        function getMatFunc(myCanvas){
            var myBlack = 0;
            var myMaterialPercentage = 0;
            //get Pixel data  
            var context = myCanvas.getContext('2d'),
            imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height),
            data = imageData.data;
            //test RED only
            for (var i = 0; i < data.length; i += 4) {
                if (data[i] == 0){
                    myBlack += 1;
                }
            }
            myMaterialPercentage = (myBlack/myDataLength) * 100;
            myMatPer.value = myMaterialPercentage.toFixed(2);
            myNewPer[0] = myMaterialPercentage;
        }



        function makeLine(coords) {
            return new fabric.Line(coords, {
                fill: 'pink',
                stroke: 'pink',
                strokeWidth: 1,
                selectable: false
            });
        }
        
        function drawFEFunc(myCanvas,nelx,nely,bool){ //300/30 = 10
            var Xdiv = myCanvas.width / nelx;
            var Ydiv = myCanvas.height / nely;
            var myCounter = 0;
            for (i = 0 ; i < myCanvas.width +1 ; i += Xdiv){
                var line1 = makeLine([i,0,i,myCanvas.height]);
                var line2 = makeLine([0,i,myCanvas.width,i]);
                myCounter += 2;
                //Draw lines
                if (bool){
                    myCanvas.add(line1,line2);
                }
            }
            var diff = myCanvas.getObjects().length - myCounter;
            if (!bool){
                for(i = myCanvas.getObjects().length ; i > diff ; i--){
                    myCanvas.remove(myCanvas.item(i));
                }
            }
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
        myStatusBar.innerHTML += " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href =''> Log out >> </a> ";
        //append myStatusBar
        myMainBody.appendChild(myStatusBar);
        //log
        console.log(myUserName + " has logged in");
    }


//});

