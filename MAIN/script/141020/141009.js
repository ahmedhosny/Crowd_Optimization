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
        myLoadBMPFunction();

    }
    //
    //Create myChallengeBoard
    //
    function myChallengeBoardFunction() {
        var myChallengeBoard = document.createElement("div");
        myChallengeBoard.id = "myChallengeBoard";
        //append myChallengeBoard
        myMainBody.appendChild(myChallengeBoard);
        myChallengeBoard.innerHTML = "Pick a Challenge.<br> or load one.<input type='file' id='myBMP'> <br> <div class='inner'>#1</div><div class='inner'>#2</div><div class='inner'>#3</div> <br> <canvas id='canvas1' width='300' height='150'> This text is displayed if your browserdoes not support HTML5 Canvas. </canvas>";
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
    //Read BMP function
    //
    function myLoadBMPFunction() {
        //
        //Get BMP for Canvas
        //
        var myBMP = document.getElementById("myBMP");
         myBMP.addEventListener("change",handleBMP,false);
         //
         //get Canvas
         //
         var canvas1 = document.getElementById('canvas1'); 
        var ctx1 = canvas1.getContext('2d');


        function handleBMP(e){
            console.log("file selected");
            var myFile = e.target.files[0];
            var myReader = new FileReader();
            myReader.addEventListener("load",processImage,false);
            myReader.readAsArrayBuffer(myFile);
    
        }
        function processImage(e){
            var buffer = e.target.result;
            var bitmap = getBMP(buffer);
            console.log(bitmap);
            var ImageData = convertToImageData(bitmap);
            ctx1.putImageData(ImageData, 0, 0);
        }
        function getBMP(buffer){
             var datav = new DataView(buffer); 
            var bitmap = {};
            bitmap.fileheader = {}; bitmap.fileheader.bfType = 
                datav.getUint16(0, true); 
            bitmap.fileheader.bfSize = 
                datav.getUint32(2, true); 
            bitmap.fileheader.bfReserved1 = 
                datav.getUint16(6, true); 
            bitmap.fileheader.bfReserved2 = 
                datav.getUint16(8, true); 
            bitmap.fileheader.bfOffBits =
                datav.getUint32(10, true);
            bitmap.infoheader = {};
            bitmap.infoheader.biSize = 
                            datav.getUint32(14, true);
            bitmap.infoheader.biWidth = 
                            datav.getUint32(18, true); 
            bitmap.infoheader.biHeight =
                            datav.getUint32(22, true); 
            bitmap.infoheader.biPlanes =
                            datav.getUint16(26, true); 
            bitmap.infoheader.biBitCount =
                            datav.getUint16(28, true); 
            bitmap.infoheader.biCompression =
                            datav.getUint32(30, true); 
            bitmap.infoheader.biSizeImage =
                            datav.getUint32(34, true); 
            bitmap.infoheader.biXPelsPerMeter =
                            datav.getUint32(38, true); 
            bitmap.infoheader.biYPelsPerMeter =
                            datav.getUint32(42, true); 
            bitmap.infoheader.biClrUsed =
                            datav.getUint32(46, true); 
            bitmap.infoheader.biClrImportant =
                            datav.getUint32(50, true);
                             var start = bitmap.fileheader.bfOffBits;  bitmap.stride =
              Math.floor((bitmap.infoheader.biBitCount
                *bitmap.infoheader.biWidth +
                                        31) / 32) * 4;
             bitmap.pixels = 
                     new Uint8Array(buffer, start); 
             return bitmap; 
        }
        function convertToImageData(bitmap) { 
             canvas = document.createElement("canvas"); 
             var ctx = canvas.getContext("2d"); 
             var Width = bitmap.infoheader.biWidth; 
             var Height = bitmap.infoheader.biHeight; 
             var imageData = ctx.createImageData(
                                       Width, Height);
             var data = imageData.data;
            var bmpdata = bitmap.pixels; 
            var stride = bitmap.stride;
            for (var y = 0; y < Height; ++y) { 
                for (var x = 0; x < Width; ++x) { 
                  var index1 = (x+Width*(Height-y))*4; 
                  var index2 = x * 3 + stride * y;
                  data[index1] = bmpdata[index2 + 2];
                  data[index1 + 1] = bmpdata[index2 + 1];
                  data[index1 + 2] = bmpdata[index2];
                  data[index1 + 3] = 255; 
                } 
            }
            return imageData;
        }
    }
});