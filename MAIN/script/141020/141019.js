//$(document).ready(

//function () {
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
    var myToolsString = " <input name='myCalculateB' type='submit' value='Calculate'><br><input name='myAddB' type='submit' value='Add'> <br><input name='myDeleteB' type='submit' value='Delete'> <br> <input name='myButton' type='submit' value='Undo'><br> <input name='myButton' type='submit' value='Redo'> <br> <inputname='myButton' type='submit' value='Save'> <br> <input name='myButton'type='submit' value='Stats'> <br> <input name='myButton' type='submit' value='Settings'> <br> <input name='myButton' type='submit' value='Help'> <br>  Area: <br> <input type='text' name='myField' value='0.344' size='12'> <br> Max V.M.Stress <input type='text' name='myField' value='4.233' size='12'><svg width='100' height='100'><circle cx='50' cy='50' r='40' stroke='green' stroke-width='4' fill='yellow' /></svg>";
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
        myGame.innerHTML = "<canvas id='myCanvas'>   </canvas><canvas id='myTempCanvas'>   </canvas>";
        var myCanvas = new fabric.Canvas("myCanvas",{
            width: 300 ,
            height: 300 ,
            isDrawingMode: true
             });



        //Delete button - white
        var myDeleteB = document.getElementsByName("myDeleteB")[0];
        myDeleteB.onmousedown = function(e){
            myCanvas.freeDrawingBrush.color = "#ffffff";  
        }
        //Delete button - white
        var myAddB = document.getElementsByName("myAddB")[0];
        myAddB.onmousedown = function(e){
            myCanvas.freeDrawingBrush.color = "#000000";  
        }

        myCanvas.freeDrawingBrush.width = 20;

        fabric.Image.fromURL(myImageURL, function(img) {
            img.set({width: myCanvas.width, height: myCanvas.height, originX: 'left', originY: 'top'});
            myCanvas.setBackgroundImage(img, myCanvas.renderAll.bind(myCanvas));
        });

        






        fabric.Image.filters.getPixels = fabric.util.createClass({
        type: 'getPixels',

        applyTo: function(myCanvas) {
            var context = myCanvas.getContext('2d'),
             imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
            data = imageData.data;
            console.log(data[0]);
        //for (var i = 0, len = data.length; i < len; i += 4) {
         //   data[i + 1] = 0;
          //   data[i + 2] = 0;
       // }

        //context.putImageData(imageData, 0, 0);
        }
        });

        //fabric.Image.filters.getPixels.fromObject = function(object) {
       //     return new fabric.Image.filters.Redify(object);
       // };

        //myCanvas.on('mouse:down', function(options) {
        //    console.log(options.e.clientX, options.e.clientY);
        //});
        myCanvas.on('path:created', function(options) {
           





           var context = myCanvas.getContext('2d'),
             imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height),
            data = imageData.data;
            console.log(data[0]);












           //myString = myCanvas.item(myCanvas.getObjects().length -1).path.toString().replace(/,/g, " ");
           //var myPath = new fabric.Path(myString);
           //var myPoint = new fabric.Point(5,5);
           //var myCheck = myPath.containsPoint(myPoint);
           //create fake canvas
           



           /*

           var myURL = myCanvas.toDataURL();
           var myImage = new Image; 
           myImage.src = myURL;
           console.log(myImage.width,myImage.height);
           //myImage.onload = function(){
                var myTempCanvas  = document.getElementById("myTempCanvas");
                myTempCanvas.width = myImage.width;
                myTempCanvas.length = myImage.length;
                myTempCanvas.getContext("2d").drawImage(myImage,0,0,myImage.width,myImage.length);
                console.log(myTempCanvas);
                var myPixel = myTempCanvas.getContext("2d").getImageData(50,50,1,1).data;
                console.log(myPixel);
            
           //}    

        */
 
           //var img = $(myVar)[0];

           //myImage = loadImage(myURL);
           //myImage.loadPixels();
           //console.log(myImage.get(10,10);
        });




        //var img = new fabric.Image(myImageURL,{
        //    left: 50,
        //    top: 50
        //});
        //myCanvas1.onmousedown = function(e){
        //    console.log("hi sid");
         //  myCanvas1.add(img); 
       // }
        

        //var myCanvas = document.getElementById("myCanvas");
        //var myContext = myCanvas.getContext("2d");
        //myCanvas.ondblclick = function(e){
        //    var img=new Image();
        //    img.src= myImageURL;
        //    myContext.drawImage(img,20,20); 
        //}
        /*

        <svg id = 'mySVG'> </svg>

        var mySVG = document.getElementById("mySVG");
        mySVG.ondblclick = function (e) {
            var posX = e.x -  x ;
            var posY =  e.y - y  ;
            console.log( "x location" , posX );
            console.log(  "y location" , posY );  
            mySVG.innerHTML += "<rect class='draggable'x='" 
            + posX + "' y=  '" + posY + "' width='140' height='40'fill='#000000' />";
        }        
        */
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


//});

