
function myGameFunction() {
    var myGame = document.createElement("div");
    myGame.id = "myGame";
    //append myChallengeBoard
    myMainBody.appendChild(myGame);
    //get relative location within page
    //var position = myGame.getBoundingClientRect();
    //var x = position.left;
    //var y = position.top;
    //v=create SVG tag
    // var mySVG = document.createElement("svg");
    // mySVG.id = "mySVG";
    // myGame.appendChild(mySVG);
    myGame.innerHTML = "<canvas id='myCanvas'> </canvas>";
    var myCanvas = window.__canvas = new fabric.Canvas("myCanvas",{
        width: 315,
        height: 315,
        isDrawingMode: true
         });

    //Brush size
    myCanvas.freeDrawingBrush.width = 20;

    //////////
    //Buttons
    //////////
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
        drawFEFunc(myCanvas,nelx,nely,true);
    }
    myShowFEB.onmouseup = function (e){
        drawFEFunc(myCanvas,nelx,nely,false);
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
        //get Mat density as the canvas is first populated
        getMatFunc(myCanvas);
        //record original here
        myOriginalPer = myMatPer.value;
    });
    myCanvas.renderAll();
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
        for (var i = 0 ; i < myCanvas.width +1 ; i += Xdiv){
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
            for(var i = myCanvas.getObjects().length ; i >= diff ; i--){
                myCanvas.remove(myCanvas.item(i));
            }
        }
    }
}
