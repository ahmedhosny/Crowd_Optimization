
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
    myGame.innerHTML = "  <canvas id='myVMCanvas'> </canvas>  <canvas id='myDispCanvas'> </canvas>  <canvas id='myCanvas'> </canvas> <canvas id='myNewCanvas'> </canvas> <canvas id='myNodeCanvas'> </canvas>"; 
    var myCanvas = window.__canvas = new fabric.Canvas("myCanvas",{
        width: 315,
        height: 315,
        isDrawingMode: true
    });




    //Brush size
    myCanvas.freeDrawingBrush.width = 20;

    //
    //var ctx1 = myCanvas.getContext('2d');
    //var ctx2 = myDispCanvas.getContext('2d');
    //ctx2.blendOnto(ctx1,'screen');
    //
    //

    ///////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    myNewCanvas = document.getElementById('myNewCanvas');
    myNewCanvas.width = 315;
    myNewCanvas.height = 315;
    var ctx = myNewCanvas.getContext('2d'), tileWidth, tileHeight;
    //Radio buttons
        //Get radio buttons
    var Radio_Add = document.getElementById('Radio_Add');
    var Radio_Sub = document.getElementById('Radio_Sub');
    var Radio_AddInc = document.getElementById('Radio_AddInc');
    var Radio_SubInc = document.getElementById('Radio_SubInc');


    //Visualization canvases
    var myDispCanvas = document.getElementById("myDispCanvas");
    myDispCanvas.width = myNewCanvas.width;
    myDispCanvas.height = myNewCanvas.height;
    var myDispCTX= myDispCanvas.getContext('2d');
    //
    var myVMCanvas = document.getElementById("myVMCanvas");
    myVMCanvas.width = myNewCanvas.width;
    myVMCanvas.height = myNewCanvas.height;
    var myVMCTX= myVMCanvas.getContext('2d');




    //This will draw the grid without any fill
    render();
    function render() {
        tileWidth = myNewCanvas.width / div;
        tileHeight = myNewCanvas.height / div;
        ctx.strokeStyle = '#000';
        ctx.lineWidth="1";
        //draw grid
        ctx.beginPath();
        for(var x = 0; x < div+1; x++) {
            ctx.moveTo(x * tileWidth, 0);
            ctx.lineTo(x * tileWidth, myNewCanvas.height);
        }
        for(var y = 0; y < div+1; y++) {
            ctx.moveTo(0, y * tileHeight);
            ctx.lineTo(myNewCanvas.width, y * tileHeight);
        }
        ctx.stroke();
    }


    function drawCellsFunc(){
        for(var i = 0 ; i < div ; i++){
            for(var j = 0 ; j < div ; j++){
                //populate all the cells
                var myVal = Math.round( math.subset(myDensityMatrix, math.index(i, j)) * 10 ) / 10 ;
                //from 0.0 t0 1.0
                switch (myVal) {
                    case 0.0:
                        ctx.fillStyle = '#ffffff';
                    break;
                    case 0.2:
                        ctx.fillStyle = '#E5E5E5';
                    break;
                    case 0.4:
                        ctx.fillStyle = '#B3B3B3';
                    break;
                    case 0.6:
                        ctx.fillStyle = '#7F7F7F';
                    break;
                    case 0.8:
                        ctx.fillStyle = '#4D4D4D';
                    break;
                    case 1.0:
                        ctx.fillStyle = '#000000';
                    break;
                }
                //now draw a rect
                ctx.fillRect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                //if current selection is also populated
                /*
                if( math.subset(myDensityMatrix, math.index(i, j)) <= 1  && i == xIndex && j == yIndex){
                    ctx.fillStyle = '#0000ff';
                    ctx.fillRect(i * tileWidth, j * tileHeight, tileWidth, tileHeight);  
                }
                */
            }
        }
    }



    
    myNewCanvas.onmousemove = function(e) {
        //Some calcs
        var rect = myNewCanvas.getBoundingClientRect(),
            mx = e.clientX - rect.left,
            my = e.clientY - rect.top,
            /// get index from mouse position
            xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
            yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);

        //1_draw all cells with material
        drawCellsFunc();
        //2_Draw grid
        render();
        //3_draw highlighted cell as thick border
        ctx.beginPath();
        ctx.lineWidth="3";
        ctx.strokeStyle = '#000';
        ctx.rect(xIndex * tileWidth, yIndex * tileHeight, tileWidth, tileHeight);
        ctx.stroke();

    }

    myNewCanvas.onmousedown = function (e){
        if (e.ctrlKey) {
            console.log("hello ctrl freak");
        }
        var rect = myNewCanvas.getBoundingClientRect(),
        mx = e.clientX - rect.left,
        my = e.clientY - rect.top,
        /// get index from mouse position
        xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
        yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);
        //////////////////////////////
        //CASE ADD - myDensityMatrix manipulation only
        //////////////////////////////
        if (Radio_Add.checked) {
            // fill the myDensityMatrix with number one
            myDensityMatrix = math.subset(myDensityMatrix, math.index(xIndex, yIndex), 1); 
            console.log(myDensityMatrix);
        }
        //////////////////////////////
        //CASE SUB - myDensityMatrix manipulation only
        ////////////////////////////////
        else if (Radio_Sub.checked) {
            // fill the myDensityMatrix with number one
            myDensityMatrix = math.subset(myDensityMatrix, math.index(xIndex, yIndex), 0); 
        }
        //////////////////////////////
        //CASE ADD INC - myDensityMatrix manipulation only
        //////////////////////////////
        else if (Radio_AddInc.checked) {
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrix, math.index(xIndex, yIndex));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal <= 0.8){
                myNewVal = myCurrentVal + 0.2;
            }
            else{
                myNewVal = 1.0; 
            }
            // fill the myDensityMatrix with number one
            myDensityMatrix = math.subset(myDensityMatrix, math.index(xIndex, yIndex), myNewVal); 
        }
        //////////////////////////////
        //CASE SUB INC - myDensityMatrix manipulation only
        //////////////////////////////
        else if (Radio_SubInc.checked) {
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrix, math.index(xIndex, yIndex));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal >= 0.2){
                myNewVal = myCurrentVal - 0.2;
            }
            else{
                myNewVal = 0.0; 
            }
            // fill the myDensityMatrix with number one
            myDensityMatrix = math.subset(myDensityMatrix, math.index(xIndex, yIndex), myNewVal); 
        }
    }
    


        /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////








    //////////////////////////////////////////////
    //Buttons
    /////////////////////////////////////////////
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

    ///////////////////////////////////////////////////////////////////
    //Show Displacement
    ///////////////////////////////////////////////////////////////////
    //Get Button
    myShowDisp = document.getElementsByName("myShowDisp")[0];
    var myShowDispVAR = 1;
    myShowDisp.onmousedown = function(e){
        //
        //CASE 1
        //
        if (myShowDispVAR == 1){
            //
            //DRAW CANVAS
            //
            //Create temp canvas (off-screen/small)
            myDispCanvasT = createCanvas(nelx+1, nely+1);
            myDispCTXT = myDispCanvasT.getContext('2d');
            //loop through canvas pixels
            for (var s = 0 ; s < nelx+1 ; s++){
                for (var t = 0 ; t < nely+1 ; t++){
                myDispCTXT.fillStyle = myDispColorArray[s][t];
                myDispCTXT.fillRect( s, t, 1, 1 );
                }
            }
            //Get real canvas
            //Global
            //Put small canvas on real big canvas
            myDispCTX.drawImage(myDispCanvasT,0,0,myNewCanvas.width,myNewCanvas.height);
            //
            //Set all black pixels in myCanvas to zero alpha chanel
            //
            var bool = false;
            alphaFunc(myNewCanvas,bool);
            //set VAR to 2
            myShowDispVAR = 2;
            //
            //Additonal step to clear myVMCanvas canvas out of the way
            //
            myVMCTX.clearRect(0,0,myVMCanvas.width,myVMCanvas.height);
        }
        //
        //CASE 2
        //
        else{
            var bool = true;
            alphaFunc(myNewCanvas,bool);
            //set VAR to 1
            myShowDispVAR = 1;
            //redraw
            drawCellsFunc();
            render();
        }


    }


    /////////////////////////////////////////////////////////////////////////
    //Show VM
    /////////////////////////////////////////////////////////////////////////
    //Get Button
    myShowVM = document.getElementsByName("myShowVM")[0];
    var myShowVMVAR = 1;
    myShowVM.onmousedown = function(e){
        //
        //Case 1
        //
        if (myShowVMVAR == 1){
            //
            //DRAW CANVAS
            //
            //Create temp canvas (off-screen/small)
            myVMCanvasT = createCanvas(nelx, nely);
            myVMCTXT = myVMCanvasT.getContext('2d');
            //loop through canvas pixels
            for (var s = 0 ; s < nelx; s++){
                for (var t = 0 ; t < nely ; t++){
                myVMCTXT.fillStyle = myVMColorArray[s][t];
                myVMCTXT.fillRect( s, t, 1, 1 );
                }
            }
            //Get real canvas
            //global
            //Put small canvas on real big canvas
            myVMCTX.drawImage(myVMCanvasT,0,0,myNewCanvas.width,myNewCanvas.height);
            //
            //Set all black pixels in myCanvas to zero alpha chanel
            //
            var bool = false;
            alphaFunc(myNewCanvas,bool);
            //set VAR to 2
            myShowVMVAR = 2;
            //
            //Additonal step to clear myDispCanvas canvas out of the way
            //
            myDispCTX.clearRect(0,0,myDispCanvas.width,myDispCanvas.height);
        }
        //
        //CASE 2
        //
        else{
            var bool = true;
            alphaFunc(myNewCanvas,bool);
            //set VAR to 1
            myShowVMVAR = 1;
            //redraw
            drawCellsFunc();
            render();
        }
    }


    /////////////////////////////////////////////////////////////////////////
    //Show Nodes
    /////////////////////////////////////////////////////////////////////////

    var myShowNB = document.getElementsByName("myShowNB")[0];
    var myNodeCanvas = document.getElementById("myNodeCanvas");
    myNodeCanvas.width = 0;
    myNodeCanvas.height = 0;

    var myShowNBVAR = 1;
    myShowNB.onmousedown = function (e){
        //
        //CASE 1
        //
        if (myShowNBVAR == 1){
            myNodeCanvas.width = myNewCanvas.width;
            myNodeCanvas.height = myNewCanvas.height;
            myPlotFrameFunc(myNodeCanvas, myCanvas, myDisp);
            myShowNBVAR = 2;
        }
        //
        //CASE 2
        //
        else{
            myNodeCanvas.width = 0;
            myNodeCanvas.height = 0;
            myShowNBVAR = 1;
        }
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
        //test RED 
        for (var i = 0; i < data.length; i += 4) {
            if (data[i] != 255){
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

//Create off DOM canvas
function createCanvas(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
//Turn alpha on (change opacity of all black pixels to transparent)
function alphaFunc(myCanvas,bool){
    //get Pixel data  
    var context = myCanvas.getContext('2d'),
    imageData = context.getImageData(0, 0, myCanvas.width, myCanvas.height),
    data = imageData.data;
    //test RED 
    for (var i = 0; i < data.length; i += 4) {
        if (data[i] != 255){
            if (bool){ //ie image is on
                data[i+3] = 255;
            }
            else{ //ie image is off
                data[i+3] = 0;
            }
        }
    }
    //now draw the context using the adjusted values
    context.putImageData(imageData,0,0);
    console.log("alpha changed");
}
