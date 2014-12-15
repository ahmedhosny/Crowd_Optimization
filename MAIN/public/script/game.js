

function myGameFunction() {
    var myGame = document.createElement("div");
    myGame.id = "myGame";
    //append myChallengeBoard
    myMainBody.appendChild(myGame);

    myGame.innerHTML = "     <myGame oncontextmenu='return false;'>  <div id='myMasterDiv'>  <canvas id='myVMCanvas'> </canvas>  <canvas id='myDispCanvas'> </canvas>  <canvas id='myNewCanvas'> </canvas>  <canvas id='myNodeCanvas'> </canvas> <canvas id='myWinLoseCanvas'> </canvas> <svg id='myBCsvg'> </svg> <canvas id='myBlockCanvas'> </canvas>  \
    <canvas id = 'myStateCanvas'> </canvas>  \
    <div id= 'myScore'> \
    <input id = 'myPlayer1' type='text' name='myPlayer1' size='20' readonly> <br> <br> \
    <input id = 'myPlayer1Score' type='text' name='myPlayer1Score' size='20' readonly> \
    <input id = 'myPlayer2' type='text' name='myPlayer2' size='20' readonly><br><br>\
    <input id = 'myPlayer2Score' type='text' name='myPlayer2Score' size='20' readonly> \
     <input id = 'myGuide' type='text' name='myGuide' size='12' readonly> <br><br>  \
     <input id = 'myGuide1' type='text' name='myGuide1' size='12' readonly> <br><br> \
     <input id = 'myGuide2' type='text' name='myGuide2' size='12' readonly> \
     </div> \
    </div>";

    var myRadioString =  ' <div id="myToolBar" >  \
    <div id="myCalB" ></div> \
    <div id="myRadioDiv">  \
    <form> <div id="radio" class="ui-buttonset">     \
    <input type="radio" id="radio1" name="radio" value="1"  class="ui-helper-hidden-accessible"><label for="radio1" class="ui-state-active ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left" role="button"><span class="ui-button-text">material</span></label>     \
    <input type="radio" id="radio2" name="radio" value="2" class="ui-helper-hidden-accessible"><label for="radio2" class=" ui-button ui-widget ui-state-default ui-button-text-only" role="button"><span class="ui-button-text">mesh</span></label>    \
     <input type="radio" id="radio3" name="radio"  value="3"  class="ui-helper-hidden-accessible"><label for="radio3" class=" ui-button ui-widget ui-state-default ui-button-text-only" role="button"><span class="ui-button-text">displacement</span></label>      \
     <input type="radio" id="radio4" name="radio"   value="4" class="ui-helper-hidden-accessible"><label for="radio4" class="ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right" role="button"><span class="ui-button-text">stress</span></label> </div>  \
     </form> </div> \
     <fieldset>  <select id="stateMenu">  </select> </fieldset>  \
     <div id="bucketDiv" >   <div class="bucket_outer">  <div id = "myMarker"> </div>  <input id = "myBucket" type="text" name="myBucket" size="12" readonly> </input>  <div class="bucket_inner">  </div> </div> </div> \
     <br><br><br><br><br><input id ="myPrompt" type="text" name="myPrompt" size="50" readonly>  \
     </div> ' ;




    //checked="checked"
    //selected="selected"


    myGame.innerHTML += myRadioString;
     


    ///////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    myNewCanvas = document.getElementById('myNewCanvas');
    myNewCanvas.width = wholeDim;
    myNewCanvas.height = wholeDim;
    var ctx = myNewCanvas.getContext('2d'), tileWidth, tileHeight;
    //Radio buttons
    //Get radio buttons
    //var Radio_Add = document.getElementById('Radio_Add');
    //var Radio_Sub = document.getElementById('Radio_Sub');
    //var Radio_AddInc = document.getElementById('Radio_AddInc');
    //var Radio_SubInc = document.getElementById('Radio_SubInc');
    //
    myBucket = document.getElementsByName("myBucket")[0];
    //
    myPrompt = document.getElementById("myPrompt");
    


    //Visualization canvases those under myNewCanvas
    var myDispCanvas = document.getElementById("myDispCanvas");
    myDispCanvas.width = myNewCanvas.width;
    myDispCanvas.height = myNewCanvas.height;
    var myDispCTX= myDispCanvas.getContext('2d');
    //
    var myVMCanvas = document.getElementById("myVMCanvas");
    myVMCanvas.width = myNewCanvas.width;
    myVMCanvas.height = myNewCanvas.height;
    var myVMCTX= myVMCanvas.getContext('2d');

    //
    var myWinLoseCanvas = document.getElementById("myWinLoseCanvas");
    myWinLoseCanvas.width = myNewCanvas.width;
    myWinLoseCanvas.height = myNewCanvas.height;
    var myWinLoseCTX= myWinLoseCanvas.getContext('2d');

    //
    var myStateCanvas = document.getElementById("myStateCanvas");
    myStateCanvas.width = 215;
    myStateCanvas.height = 315;
    var myStateCTX = myStateCanvas.getContext('2d');
    myStateCTX.font="20px Open Sans";

    var myBlockCanvas = document.getElementById('myBlockCanvas');


    //////////////////////
    //players and player names
    //////////////////////
    myPlayer1 = document.getElementById("myPlayer1");  
    myPlayer2 = document.getElementById("myPlayer2");
    //this will always be me
    myPlayer1.value =  me.name;
    //second one will always be the other
    if(other){
        myPlayer2.value =  other.name;
    }
    else{
        myPlayer2.value =  "not in yet";  
    }

    //when other player logs in
    socket.on("update", function(data){
        myPlayer2.value =  other.name;
    });



    ///////////////////////
    //Player scores
    //////////////////////
    myPlayer1Score = document.getElementById("myPlayer1Score");
    myPlayer2Score = document.getElementById("myPlayer2Score");
    myPlayer1Score.value = 0;
    myPlayer2Score.value = 0;


    

/*
    Object.observe(myPlayer1temp, function(){
        myPlayer1.value =  myPlayer1temp;
    });

    Object.observe(myPlayer2temp, function(){
        myPlayer2.value =  myPlayer2temp;
    });

*/
    ///////////////////////////////////////////
    //BC visualization on svg
    ///////////////////////////////////////////
    mySnap = Snap('#myBCsvg');
    //draw supports
    dx = myNewCanvas.width / div;

    mySnap.clear();

    for (var i = 0 ; i < mySupport.length ; i++){  
        var supportCircle = mySnap.circle(mySupport[i][0] * dx + 80 , mySupport[i][1] * dx + 80 , 8);
        supportCircle.attr({
        fill: "#09b39c",
        stroke: "#000",
        strokeWidth: 3
        });
    }

    //draw force
    for (var i = 0 ; i < myForce.length ; i++){
        var column = myForce[i][0];
        var row = myForce[i][1];
        var forceCircle = mySnap.circle(column * dx + 80 , row * dx + 80 , 8);
        forceCircle.attr({
        fill: "#d43939",
        stroke: "#000",
        strokeWidth: 3
        });
    }
    /////////////////////////////////////////////
    //
    ////////////////////////////////////////////
    //twoElementArray = math.subset(myDensityArray, math.index(myForce[i][0], myForce[i][1]));


    //
    myGuide = document.getElementById("myGuide");
    myGuide1 = document.getElementById("myGuide1");
    myGuide2 = document.getElementById("myGuide2");
    

    //////////////////
    //this will draw the canvas the first time
    //////////////////

    //1_draw all cells with material
    drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
    //2_Draw grid
    render();
    //adjust bar
    adjustDensityAndBar();





    function render() {
        tileWidth = myNewCanvas.width / div;
        tileHeight = myNewCanvas.height / div;
        ctx.strokeStyle = '#e0cab1';
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


    function drawCellsFunc(myDensityMatrix){
        for(var i = 0 ; i < div ; i++){
            for(var j = 0 ; j < div ; j++){
                //populate all the cells
                var myVal = Math.round( math.subset(myDensityMatrix, math.index(i, j)) * 100 ) / 100 ;
                //from 0.0 t0 1.0
                switch (myVal) {
                    case 0.0:
                        ctx.fillStyle = '#fefefe'; // almost white, but not quite.
                    break;
                    case 0.25:
                        ctx.fillStyle = '#B8B8B8';
                    break;
                    case 0.50:
                        ctx.fillStyle = '#787878 ';
                    break;
                    case 0.75:
                        ctx.fillStyle = '#404040';
                    break;
                    case 1.0:
                        ctx.fillStyle = '#000000';
                    break;
                }
                //now draw a rect
                ctx.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
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

    //////////////////////////////////////
    // when a new densitymatrix comes in 
    //////////////////////////////////////

    socket.on('newX', function(data){
        //some data parsing
        var myMatrix = math.matrix(data);
       // console.log(myMatrix);
            //1_draw all cells with material
            myDensityMatrixContainer[myCurrentStateIndex] = myMatrix;
            
            if(myMeshFlag){
                drawMeshFunc();
            }
            else if(myDispFlag){
                drawDispFunc();
            }
            else if(myStressFlag){
                drawVMFunc();
            }
            else{
                drawCellsFunc(myMatrix);
                //2_Draw grid
                render();
                //
            }   
            adjustDensityAndBar();

       // console.log("client got newX");
    });



    //////////////////////////////////////
    //when you Win or Lose
    //////////////////////////////////////

    socket.on('winner', function(data){
        console.log('you Win');
        winFunc(true);
    });

    socket.on('loser', function(data){
        console.log('you Lose');
        winFunc(false);
    });
    socket.on('reveal', function(data){
        console.log('optimum revealed');
        myWinLoseCanvas.width = 0;
        myWinLoseCanvas.height = 0;
    });


    //////////////////////////////////////
    //when you get blocked or allowed
    //////////////////////////////////////

    socket.on('block', function(data){
        console.log('you have been blocked');
        block();
        //change values

        if(data.id == me.id){
            myPlayer1Score.value = data.score;
        }
        else {
            myPlayer2Score.value = data.score;
        }

        if(myFirstLogin == 1){
            myPlayer2Score.value = "0";
            myFirstLogin = 2;
        }
        

    });


    socket.on('allow', function(data){
        
        //need to recalculate here
        myCalculateFunctionWithoutScore (true, true);

        //to redraw immedialtely after solving
        if(myMeshFlag){
            drawMeshFunc();
        }
        else if(myDispFlag){
            drawDispFunc();
        }
        else if(myStressFlag){
            drawVMFunc();
        }

        console.log("recalculated you fucker");

        //then allow

        console.log('you can play now');
        allow();
        //changeValues
        
        if(data.id == me.id){
            myPlayer1Score.value = data.score;
        }
        else {
            myPlayer2Score.value = data.score;
        }

        //set the counter to 0
        myMaterialCounter = 0;

        if(myFirstLogin == 1){
            myPlayer2Score.value = "0";
            $('#myNewCanvas').trigger('click');
            myFirstLogin = 2;
        }
        


    });

    


    //////////////////////////////////////
    //myNewCanvas on mouse out
    //////////////////////////////////////


     myNewCanvas.onmouseout = function(e) {
        //Some calcs
        var rect = myNewCanvas.getBoundingClientRect(),
            mx = e.clientX - rect.left,
            my = e.clientY - rect.top,
            /// get index from mouse position
            xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
            yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);

        if (myStressFlag || myDispFlag || myMeshFlag){
            //clear out the myNewCanvas
            var bool = false;
            alphaFunc(myNewCanvas,bool);
        }   
        else { 
            //1_draw all cells with material
            drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
            //2_Draw grid
            render();
        }

    }

    //////////////////////////////////////
    //myNewCanvas on mouse move
    //////////////////////////////////////
    
    myNewCanvas.onmousemove = function(e) {

                //Some calcs
        var rect = myNewCanvas.getBoundingClientRect(),
            mx = e.clientX - rect.left,
            my = e.clientY - rect.top,
            /// get index from mouse position
            xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
            yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);



        if (myStressFlag || myDispFlag || myMeshFlag){
            $('#myNewCanvas').css('opacity','0.3');
            drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
            //
            render();
            //3_draw highlighted cell as thick border
            ctx.beginPath();
            ctx.lineWidth="3";
            ctx.strokeStyle = '#d43939';
            ctx.rect(xIndex * tileWidth, yIndex * tileHeight, tileWidth, tileHeight);
            ctx.stroke();

        }




        else {
            //1_draw all cells with material
            drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
            //console.log("ommousemove " + myCurrentStateIndex);
            //console.log( " the current one")
            //console.log(myDensityMatrixContainer[myCurrentStateIndex]);
            //2_Draw grid
            render();
            //3_draw highlighted cell as thick border
            ctx.beginPath();
            ctx.lineWidth="3";
            ctx.strokeStyle = '#d43939';
            ctx.rect(xIndex * tileWidth, yIndex * tileHeight, tileWidth, tileHeight);
            ctx.stroke();
        }

    }



    //////////////////////////////////////
    //myNewCanvas on mouse down
    //////////////////////////////////////


    myNewCanvas.onmousedown = function (e){
        //set a temp equal to density matrix
        var myTemp = myDensityMatrixContainer[myCurrentStateIndex] ;

        var rect = myNewCanvas.getBoundingClientRect(),
        mx = e.clientX - rect.left,
        my = e.clientY - rect.top,
        /// get index from mouse position
        xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
        yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);
        //
        //
        var addflag = false;
        var subflag = false;
        //////////////////////////////
        //CASE ADD INC - myDensityMatrix manipulation only
        // left 
        //////////////////////////////
        if (e.which == 1 ) {
            //Radio_AddInc.checked = true;
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(yIndex, xIndex ));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal <= 0.75){
                myNewVal = myCurrentVal + 0.25;
            }
            else{
                myNewVal = 1.0; 
            }
            // fill the myDensityMatrix with new val
            myDensityMatrixContainer[myCurrentStateIndex] = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(yIndex, xIndex ), myNewVal); 
            myPrompt.value = "Material added.";
            //
            addflag = true;
            subflag = false;

        }
        //////////////////////////////
        //CASE SUB INC - myDensityMatrix manipulation only
        // right 
        //////////////////////////////
        else if (e.which == 3 ) { 
            //Radio_SubInc.checked = true;
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(yIndex, xIndex ));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal >= 0.25){
                myNewVal = myCurrentVal - 0.25;
            }
            else{
                myNewVal = 0.0; 
            }
            // fill the myDensityMatrix with new val
            myDensityMatrixContainer[myCurrentStateIndex] = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(yIndex, xIndex ), myNewVal);
            myPrompt.value = "Material subtracted."; 
            //
            addflag = false;
            subflag = true;
        }

        /////////////////////////////
        //Now adjust myDensity
        ////////////////////////////
        adjustDensityAndBar();

        ///////////////////////////
        //Send the density martrix to the server - send it as is (not data) - but first change the values of 0 to 0.0001
        //////////////////////////

        myDensityMatrixContainer[myCurrentStateIndex] = elementDensityFunc(myDensityMatrixContainer[myCurrentStateIndex],div);
        socket.emit("userClicked",{data:myDensityMatrixContainer[myCurrentStateIndex]});
        //console.log("userNewX");

        ///////////////////////////
        //if density matrix has actualy changed, then 
        ///////////////////////////
        if(myTemp._data.equals(myDensityMatrixContainer[myCurrentStateIndex]._data) == false && myClickCounter < 4) {
            myClickCounter+=1;
            if(addflag){
                //add 0.5 to myMaterialCounter
                myMaterialCounter += 0.5
            }
            else if(subflag){
                myMaterialCounter -= 0.5
            }
        }


        //if number of clicks exceeded
        if(myClickCounter == 4){
            myClickCounter = 0;
            //
            console.log("mymaterialcounter", myMaterialCounter);
            //////////////
            //display calculation
            NProgress.configure({ parent: '#myGame' });
            //NProgress.inc(0.3);
            NProgress.configure({ minimum: 0.2});
            NProgress.start(); 
            NProgress.inc(0.1);
            myPrompt.value = "Calculating...";
            //////////////
            //now calculate
            //////////////
            myCalculateFunction (true, true);
            //to redraw immedialtely after solving
            if(myMeshFlag){
                drawMeshFunc();
            }
            else if(myDispFlag){
                drawDispFunc();
            }
            else if(myStressFlag){
                drawVMFunc();
            }
            // Now emit
            socket.emit("outOfClicks", {score:myUserScore, id:me.id} );
        }

    }

    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////



    //////////////////////////////////////////////
    //state menu
    /////////////////////////////////////////////

    $(function() {
        $( "#stateMenu" )
            .selectmenu()
            .selectmenu( "menuWidget" )
            .addClass( "overflow" );
    });

    $("#stateMenu").on('selectmenuchange', function() {
        myCurrentStateIndex = $( "#stateMenu" ).val();

        //display that state on myNewCanvas here...
        //1_draw all cells with material
        drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
        //2_Draw grid
        render();

        adjustDensityAndBar();
        //close the menu
        //$( "#stateMenu" ).close();


        //check is less than length of list - to avoid overwriting existing solutions
        //console.log(myCurrentStateIndex);
        if (myCurrentStateIndex < myDensityMatrixContainer.length -1){
            //console.log ("less than biatch"); 
            myDuplicateFlag = true;
            //get last Matrix and set it to matrix of myCurrentStateIndex
            myDensityMatrixContainer[myDensityMatrixContainer.length -1] = myDensityMatrixContainer[myCurrentStateIndex];
            //set myCurrentStateIndex to last element
            myCurrentStateIndex = myDensityMatrixContainer.length -1;

        }

        //console.log(myCurrentStateIndex);


        //Recalculate but dont add a new array to myDensityMatrixContainer...(this will set index to last item in container)
        var myBoolean = false;
        myCalculateFunction(myBoolean, myBoolean);

        //Now adjust mesh, disp and VM (they will adjust anyways - but just to adjust them if they are active)
        if(myRadioVal == 2){
            drawMeshFunc();
        }
        //
        // Disp
        //
        else if(myRadioVal == 3){
            drawDispFunc();
        }
         //
        // VM (4)
        //
        else if(myRadioVal == 4){
            drawVMFunc();
        }

        //Now we will treat the change here as if the user clicked - so that the new state is propagated to all users
        socket.emit("userClicked",{data:myDensityMatrixContainer[myCurrentStateIndex]});
        //console.log("userNewX - state changed");

    });






    //////////////////////////////////////////////
    //Buttons
    /////////////////////////////////////////////
    $(function() {
        $( "#radio" ).buttonset();
    });

    myNodeCanvas.width = 0;
    myNodeCanvas.height = 0;

    $('#radio input').on('change', function() {
        myRadioVal = $('input[name=radio]:checked', '#radio').val(); 
        drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);

        //
        // Material
        //
        if (myRadioVal == 1){
            //for flags
            myMeshFlag = false;
            myStressFlag = false;
            myDispFlag = false;
            //draw BS as I like it
            drawBCbeforeFunc(mySnap,dx);

            $('#myNewCanvas').css('opacity','1.0');
            //for Mesh
            myNodeCanvas.width = 0;
            myNodeCanvas.height = 0;
            //for disp and VM
            var bool = true;
            alphaFunc(myNewCanvas,bool);
            drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
            render();
        }
        //
        // Mesh
        //
        else if(myRadioVal == 2){
            drawMeshFunc();
        }
        //
        // Disp
        //
        else if(myRadioVal == 3){
            drawDispFunc();
        }
         //
        // VM (4)
        //
        else if(myRadioVal == 4){
            drawVMFunc();
        }

    });


    ///////////////////////////
    //Calculate button
    ///////////////////////////////
    // this counter will count how may times the counter was clicked.
    /*
    var myCalBCounter = 0;
    $(function() {
        var myBoolean = true;
        $( "#myCalB" ).button()
        //
        .click(function(){ 
            myCalculateFunction (myBoolean, myBoolean);
            //to redraw immedialtely after solving
            if(myMeshFlag){
                drawMeshFunc();
            }
            else if(myDispFlag){
                drawDispFunc();
            }
            else if(myStressFlag){
                drawVMFunc();
            }
            //Now we want to draw the canvas on the side
            myStateCTX.drawImage(myNewCanvas,0,105*myCalBCounter,100,100);
            myStateCTX.fillText(myGuide2.value,125 ,105*myCalBCounter + 60);
            if (myStressFlag || myDispFlag || myMeshFlag){

            // 1_draw all cells with material
            drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
            // 2_Draw grid
            render();
            // Draw it
            myStateCTX.drawImage(myNewCanvas,0,105*myCalBCounter,100,100);
            // clear out the myNewCanvas
            var bool = false;
            alphaFunc(myNewCanvas,bool);
           }   
            //now we want to add one to the counter
            myCalBCounter+=1;
        })
        //
        .mouseover(function(){
            NProgress.configure({ parent: '#myGame' });
            //NProgress.inc(0.3);
            NProgress.configure({ minimum: 0.2});
            var delay=50;
            setTimeout(function(){
                NProgress.start(); 
                NProgress.inc(0.1);
                myPrompt.value = "Calculating...";
            },delay); 

        });
     });

*/

    //////////////////////////////////
    //Functions to draw objects within myGame
    //////////////////////////////////


    //Draw mesh, disp anf func as if the radio buttons where clicked
    function drawMeshFunc(){

     
           //for flags
        myMeshFlag = true;
        myDispFlag = false;
        myStressFlag = false;
        $('#myNewCanvas').css('opacity','0.0');
        // draw the BC as I like them
        drawBCafterFunc(mySnap,dx);

        //clear out
        myVMCTX.clearRect(0,0,myVMCanvas.width,myVMCanvas.height);
        myDispCTX.clearRect(0,0,myDispCanvas.width,myDispCanvas.height);

        myNodeCanvas.width = myNewCanvas.width + 160;
        myNodeCanvas.height = myNewCanvas.height + 160;
        myPlotFrameFunc(myNodeCanvas, myNewCanvas, myDisp);
    }

    function drawDispFunc(){

        //for flags
        myMeshFlag = false;
        myDispFlag = true;
        myStressFlag = false;
        //for Mesh
        myNodeCanvas.width = 0;
        myNodeCanvas.height = 0;
        //draw BC as  i like it
        drawBCbeforeFunc(mySnap,dx);
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
        //
        //Additonal step to clear myVMCanvas canvas out of the way
        //
        myVMCTX.clearRect(0,0,myVMCanvas.width,myVMCanvas.height);
    }
     

    function drawVMFunc(){
        //for flags
        myMeshFlag = false;
        myDispFlag = false;
        myStressFlag = true;
        //for Mesh
        myNodeCanvas.width = 0;
        myNodeCanvas.height = 0;
        //BC as I like it
        drawBCbeforeFunc(mySnap,dx);
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
        //
        //Additonal step to clear myDispCanvas canvas out of the way
        //
        myDispCTX.clearRect(0,0,myDispCanvas.width,myDispCanvas.height);
    }   

    //
    //Win
    //
    function winFunc(boola){
        //either way, delete the chess
        $("#myToolBar").find("img").remove();
        if(boola){
            var myWinMatrix = [[1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,0.0,1.0,1.0,1.0,0.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,0.0,1.0,1.0,1.0,0.0,1.0],
                              [1.0,1.0,0.0,0.0,0.0,1.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0]
                              ];

            for(var i = 0 ; i < div ; i++){
                for(var j = 0 ; j < div ; j++){
                    //populate all the cells
                    var myVal = myWinMatrix[i][j];
                    //from 0.0 t0 1.0
                    if (myVal == 0.0){
                        myWinLoseCTX.fillStyle = '#e0cab1';
                    }
                    else{
                        myWinLoseCTX.fillStyle = '#09b39c';
                    }
                    //now draw a rect
                    myWinLoseCTX.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
                }
            }
        }
        else{
            var myWinMatrix = [[1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,0.0,1.0,1.0,1.0,0.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                              [1.0,1.0,0.0,0.0,0.0,1.0,1.0],
                              [1.0,0.0,1.0,1.0,1.0,0.0,1.0],
                              [1.0,1.0,1.0,1.0,1.0,1.0,1.0]
                              ];

            for(var i = 0 ; i < div ; i++){
                for(var j = 0 ; j < div ; j++){
                    //populate all the cells
                    var myVal = myWinMatrix[i][j];
                    //from 0.0 t0 1.0
                    if (myVal == 0.0){
                        myWinLoseCTX.fillStyle = '#e0cab1';
                    }
                    else{
                        myWinLoseCTX.fillStyle = '#d43939';
                    }
                    //now draw a rect
                    myWinLoseCTX.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
                }
            }
        }
        // now draw grid on top of that
        myWinLoseCTX.strokeStyle = '#e0cab1';
        myWinLoseCTX.lineWidth="2";
        //draw grid
        myWinLoseCTX.beginPath();
        for(var x = 0; x < div+1; x++) {
            myWinLoseCTX.moveTo(x * tileWidth, 0);
            myWinLoseCTX.lineTo(x * tileWidth, myNewCanvas.height);
        }
        for(var y = 0; y < div+1; y++) {
            myWinLoseCTX.moveTo(0, y * tileHeight);
            myWinLoseCTX.lineTo(myNewCanvas.width, y * tileHeight);
        }
        myWinLoseCTX.stroke();
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
        if (data[i] != 255 && data[i+1] != 255 && data[i+2] != 255){
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
}
//calculate density function
function calDensityFunc(div, myDensityMatrix){
    var myDensity = 0.0;
        for(var i = 0 ; i < div ; i++){
            for(var j = 0 ; j < div ; j++){
                //populate all the cells
                myDensity += (math.subset(myDensityMatrix, math.index(i, j)) * 10 ) / 10 ;
            }
        }
        return myDensity;
}


function addOption(){
   
    var options = [];

   // Clear the options first   
   $("#stateMenu option").each(function(index, option) {
        $(option).remove();
   });

   //loop and populate
   for (i = 0; i < myDensityMatrixContainer.length ; i++) {
        //  When it shows the current state that hasnt been calculated yet
        if( i == myDensityMatrixContainer.length - 1){
            options.push("<option value='" + i + "'>" + 'new state ' + "</option>");   
        }
        else{
            options.push("<option value='" + i + "'>" + 'U ' + myScoresPer[i][0] + ', S ' + myScoresPer[i][1]+  ', C ' + myScoresPer[i][2] + "</option>");    
        }
    }



     //append after populating all options
    $('#stateMenu').append(options.join("")).selectmenu();

    $('#stateMenu').selectmenu('refresh');

}

function adjustDensityAndBar(){

        var myDensity = calDensityFunc(div, myDensityMatrixContainer[myCurrentStateIndex]); 

        //change bar reading
        var bar = document.getElementsByClassName("bucket_inner")[0];
        var val = (myDensity/(nelx*nely)*100).toFixed(1) + '%';
        $(bar).animate({width: val}, 200);
        myBucket.value = val;

        //now for density reached - to server
        var myDensityPer = (myDensity/(nelx*nely)*100).toFixed(1);
        if (myDensityPer <= myTargetDensity){
            //send to server

            //
            // Need some function here to calculate myScore
            //

            socket.emit("targertDensityReached",{data:myUserScoreTotal});
            //console.log("target density reached")

            //set the bucket to target density so we dont get decimal places - very clean!
            myBucket.value = myTargetDensity + '%';
        }
}



function drawBCafterFunc(mySnap,dx){

    mySnap.clear();

    for (var i = 0 ; i < mySupport.length ; i++){  
        var supportCircle = mySnap.circle(mySupport[i][0] * dx + 80 , mySupport[i][1] * dx + 80 , 8);
        supportCircle.attr({
        fill: "#09b39c",
        stroke: "#000",
        strokeWidth: 3
        });
    }

        ////
    for (var i = 0 ; i < myForce.length ; i++){
        var column = myForce[i][0];
        var row = myForce[i][1];
        var forceCircle = mySnap.circle(column * dx + 80 + myDispArray2[column][row][0] , row * dx + 80 + myDispArray2[column][row][1]*(-1), 8);
        forceCircle.attr({
        fill: "#d43939",
        stroke: "#000",
        strokeWidth: 3
        });
    }

}

function drawBCbeforeFunc(s,dx){

    mySnap.clear();

    //draw support
    for (var i = 0 ; i < mySupport.length ; i++){  
        var supportCircle = mySnap.circle(mySupport[i][0] * dx + 80 , mySupport[i][1] * dx + 80 , 8);
        supportCircle.attr({
        fill: "#09b39c",
        stroke: "#000",
        strokeWidth: 3
        });
    }

    //draw force
    for (var i = 0 ; i < myForce.length ; i++){
        var column = myForce[i][0];
        var row = myForce[i][1];
        var forceCircle = mySnap.circle(column * dx + 80 , row * dx + 80 , 8);
        forceCircle.attr({
        fill: "#d43939",
        stroke: "#000",
        strokeWidth: 3
        });
    }   

}


function calculateScoreFunc(){

}


// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
} 

function block(){
    
    $("#myToolBar").find("img").remove();
    $('#myToolBar').prepend('<img id="block" src="img/block.png" />');
    myBlockCanvas.width = myNewCanvas.width;
    myBlockCanvas.height = myNewCanvas.height;

}


function allow(){
    
    $("#myToolBar").find("img").remove();
    $('#myToolBar').prepend('<img id="allow" src="img/allow.png" />');
    myBlockCanvas.width = 0;
    myBlockCanvas.height = 0;

}

