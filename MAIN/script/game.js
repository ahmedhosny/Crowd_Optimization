
function myGameFunction() {
    var myGame = document.createElement("div");
    myGame.id = "myGame";
    //append myChallengeBoard
    myMainBody.appendChild(myGame);
    myGame.innerHTML = "      <myGame oncontextmenu='return false;'>  <canvas id='myVMCanvas'> </canvas>  <canvas id='myDispCanvas'> </canvas>  <canvas id='myNewCanvas'> </canvas>  <canvas id='myNodeCanvas'> </canvas> <div id='myProgressDiv'> </div>";
    var myRadioString =  ' <div id="myToolBar" >  \
    <div id="myCalB" class="ui-button ui-widget ui-state-default ui-corner-all" role="button"><span class="ui-icon ui-icon-calculator"></span></div> \
    <div id="myRadioDiv">  \
    <form> <div id="radio" class="ui-buttonset">     \
    <input type="radio" id="radio1" name="radio" value="1"                   class="ui-helper-hidden-accessible"><label for="radio1" class="ui-state-active ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left" role="button"><span class="ui-button-text">material</span></label>     \
    <input type="radio" id="radio2" name="radio" value="2"                 class="ui-helper-hidden-accessible"><label for="radio2" class=" ui-button ui-widget ui-state-default ui-button-text-only" role="button"><span class="ui-button-text">mesh</span></label>    \
     <input type="radio" id="radio3" name="radio"  value="3"                 class="ui-helper-hidden-accessible"><label for="radio3" class=" ui-button ui-widget ui-state-default ui-button-text-only" role="button"><span class="ui-button-text">displacement</span></label>      \
     <input type="radio" id="radio4" name="radio"   value="4"                class="ui-helper-hidden-accessible"><label for="radio4" class="ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right" role="button"><span class="ui-button-text">stress</span></label> </div>  \
     </form> </div> \
     <br> <fieldset>  <select id="stateMenu">  </select> </fieldset>  \
     <div id="bucketDiv" > <div class="bucket_outer"> <input id = "myBucket" type="text" name="myBucket" size="12"><div class="bucket_inner"> <div></div> </div> </div> </div> \
     <br> <br> <br> <br> <input id ="myPrompt" type="text" name="myPrompt" size="50" readonly>  \
     </div> ' ;








//checked="checked"
//selected="selected"


    myGame.innerHTML += myRadioString;
     




 



    ///////////////////////////////////////////////
    /////////////////////////////////////////////////
    /////////////////////////////////////////////////
    myNewCanvas = document.getElementById('myNewCanvas');
    myNewCanvas.width = 315;
    myNewCanvas.height = 315;
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
    //
    var myProgressDiv = document.getElementById('myProgressDiv');



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
    



    //This will draw the grid without any fill
    render();
    function render() {
        tileWidth = myNewCanvas.width / div;
        tileHeight = myNewCanvas.height / div;
        ctx.strokeStyle = '#006400';
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

        //1_draw all cells with material
        drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
        //2_Draw grid
        render();

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

        //1_draw all cells with material
        drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
        console.log("ommousemove " + myCurrentStateIndex);
        console.log( " the current one")
        console.log(myDensityMatrixContainer[myCurrentStateIndex]);
        //2_Draw grid
        render();
        //3_draw highlighted cell as thick border
        ctx.beginPath();
        ctx.lineWidth="3";
        ctx.strokeStyle = '#000';
        ctx.rect(xIndex * tileWidth, yIndex * tileHeight, tileWidth, tileHeight);
        ctx.stroke();

    }

    //
    //JQUERY
    //
    $(document).keydown(function(event){
    if(event.which=="17")
        cntrlIsPressed = true;
    });

    $(document).keyup(function(){
        cntrlIsPressed = false;
    });
    var cntrlIsPressed = false;

    //////////////////////////////////////
    //myNewCanvas on mouse down
    //////////////////////////////////////


    myNewCanvas.onmousedown = function (e){

        var rect = myNewCanvas.getBoundingClientRect(),
        mx = e.clientX - rect.left,
        my = e.clientY - rect.top,
        /// get index from mouse position
        xIndex = Math.round((mx - tileWidth * 0.5) / tileWidth),
        yIndex = Math.round((my - tileHeight * 0.5) / tileHeight);
        //////////////////////////////
        //CASE ADD - myDensityMatrix manipulation only
        //Left click
        //////////////////////////////
        if (e.which == 1 && cntrlIsPressed==false) { 
            // Radio_Add.checked = true;
            // fill the myDensityMatrix with number one
            myDensityMatrixContainer[myCurrentStateIndex]= math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex), 1); 
            myPrompt.value = "Material added.";

        }
        //////////////////////////////
        //CASE SUB - myDensityMatrix manipulation only
        //Right click
        ////////////////////////////////
        else if (e.which == 3 && cntrlIsPressed==false) {
            //Radio_Sub.checked = true;
            // fill the myDensityMatrix with number one
            myDensityMatrixContainer[myCurrentStateIndex] = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex), 0); 
            myPrompt.value = "Material subtracted.";
        }
        //////////////////////////////
        //CASE ADD INC - myDensityMatrix manipulation only
        // left + ctrl
        //////////////////////////////
        else if (e.which == 1 && cntrlIsPressed) {
            //Radio_AddInc.checked = true;
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal <= 0.8){
                myNewVal = myCurrentVal + 0.2;
            }
            else{
                myNewVal = 1.0; 
            }
            // fill the myDensityMatrix with number one
            myDensityMatrixContainer[myCurrentStateIndex] = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex), myNewVal); 
            myPrompt.value = "Material added.";
        }
        //////////////////////////////
        //CASE SUB INC - myDensityMatrix manipulation only
        // right + ctrl
        //////////////////////////////
        else if (e.which == 3 && cntrlIsPressed) { 
            //Radio_SubInc.checked = true;
            //Get value at that index
            var myCurrentVal = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex));
            var myNewVal;
            //Value to substitute
            if(myCurrentVal >= 0.2){
                myNewVal = myCurrentVal - 0.2;
            }
            else{
                myNewVal = 0.0; 
            }
            // fill the myDensityMatrix with number one
            myDensityMatrixContainer[myCurrentStateIndex] = math.subset(myDensityMatrixContainer[myCurrentStateIndex], math.index(xIndex, yIndex), myNewVal);
            myPrompt.value = "Material subtracted."; 
        }

        /////////////////////////////
        //Now adjust myDensity
        ////////////////////////////
        adjustDensityAndBar();
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
        console.log(myCurrentStateIndex);
        if (myCurrentStateIndex < myDensityMatrixContainer.length -1){
            console.log ("less than biatch"); 
            myDuplicateFlag = true;
            //get last Matrix and set it to matrix of myCurrentStateIndex
            myDensityMatrixContainer[myDensityMatrixContainer.length -1] = myDensityMatrixContainer[myCurrentStateIndex];
            //set myCurrentStateIndex to last element
            myCurrentStateIndex = myDensityMatrixContainer.length -1;
        }

        console.log(myCurrentStateIndex);


        //Recalculate but dont add a new array to myDensityMatrixContainer...(this will set index to last item in container)
        var myBoolean = false;
        myCalculateFunction(myBoolean, myBoolean);



        //Now adjust myDensity and Bar
        ////////////////////////////

       



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
        var myVal = $('input[name=radio]:checked', '#radio').val(); 
        drawCellsFunc(myDensityMatrixContainer[myCurrentStateIndex]);
        
        //
        // Material
        //
        if (myVal == 1){
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
        else if(myVal == 2){

            myNodeCanvas.width = myNewCanvas.width;
            myNodeCanvas.height = myNewCanvas.height;
            myPlotFrameFunc(myNodeCanvas, myNewCanvas, myDisp);

        }
        //
        // Disp
        //
        else if(myVal == 3){
            //for Mesh
            myNodeCanvas.width = 0;
            myNodeCanvas.height = 0;





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
         //
        // VM (4)
        //
        else if(myVal == 4){
            //for Mesh
            myNodeCanvas.width = 0;
            myNodeCanvas.height = 0;




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

    });


    ///////////////////////////
    //Calculate button
    ///////////////////////////////



    $(function() {
        var myBoolean = true;
        $( "#myCalB" ).button()
        //
        .click(function(){ 
            myCalculateFunction (myBoolean, myBoolean);
        })
        //
        .mouseover(function(){
            NProgress.configure({ parent: '#myProgressDiv' });
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
        options.push("<option value='" + i + "'>" + i + "</option>");
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

}