function List2Array(list,nelx,nely){ //+1
	var my2dArray = [];
	for (var i = 0 ; i < list.length ; i += nelx){
		var my2dArrayTemp = [];
		for (var k = i ; k < nely + i ; k++){
			my2dArrayTemp.push(list[k]);
		}
		my2dArray.push(my2dArrayTemp);
	}
	return my2dArray;
}

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function VisDispFunc (U){
	//Build a canvas that is nelx+1 and nely+1 pixels wide and high
	//get vector using Pythagoras
	var myUList = [];
	var myColorList = [];
	for (var i = 0 ; i < U.length ; i+=2){
		var A = U[i], B = U[i+1];
		var C = math.sqrt(math.pow(A,2) + math.pow(B,2));
		myUList.push(C);
	}
	//get colors
	var myRainbow = new Rainbow();
	//set spectrum
	//myRainbow.setSpectrum('blue','aqua' ,'green', 'lime', 'yellow','orange', 'red');
	myRainbow.setSpectrum('blue', 'lime', 'yellow', 'red');
	//set domain
	var myMin = _.min(myUList), myMax = _.max(myUList);
	myRainbow.setNumberRange(myMin, myMax)
	//loop
	for (var k = 0 ; k < myUList.length ; k++){
		myHex = myRainbow.colorAt(myUList[k]); 
		//convert to rgba
		myRGBA = convertHex(myHex,100);
		myColorList.push(myRGBA);
	}
	//Convert list into array
	myDispColorArray = List2Array(myColorList,nelx+1,nely+1);
	return myDispColorArray;
}



function VisVMFunc(myElementVMStress){
	//Build a canvas that is nelx and nely pixels wide and high
	var myColorList = [];
	//get colors
	var myRainbow = new Rainbow();
	//set spectrum
	//myRainbow.setSpectrum('blue','aqua' ,'green', 'lime', 'yellow','orange', 'red');
	myRainbow.setSpectrum('blue', 'lime', 'yellow', 'red');
	//set domain
	var myMin = _.min(myElementVMStress), myMax = _.max(myElementVMStress);
	myRainbow.setNumberRange(myMin, myMax)
	//loop
	for (var k = 0 ; k < myElementVMStress.length ; k++){
		myHex = myRainbow.colorAt(myElementVMStress[k]); 
		//convert to rgba
		myRGBA = convertHex(myHex,100);
		myColorList.push(myRGBA);
	}
	//Convert list into array
	myVMColorArray = List2Array(myColorList,nelx,nely);
	return myVMColorArray;
}

function myPlotFrameFunc(myNodeCanvas,myCanvas, myDisp){
	//two states = before and after
	//set dims of myNodeCanvas to original canvas
    //Set width and height
    myNodeCanvas.width = myCanvas.width+50;// add right and left
    myNodeCanvas.height = myCanvas.height+50;// add top and bottom
    //Get context and draw circles...
    var radius = 3;
	var context = myNodeCanvas.getContext('2d');
	var dx = myCanvas.width/nelx;
	var dy = myCanvas.height/nely;
	context.lineWidth = 1;
	//
	//before case
	//
	for (var i = 0 ; i < nelx + 1 ; i++){
		for (var j = 0 ; j < nely + 1 ; j++){
			//draw nodes
			context.beginPath();
			context.arc(i*dx , j*dy , radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'cyan';
			context.fill();
			context.strokeStyle = '#00ffff';
			//Draw edges vertical
			if(j<nely){
      			context.moveTo(i*dx, j*dy);
      			context.lineTo(i*dx, (j+1)*dy);
			}
			//Draw edges horizontal
			if(i<nelx){
      			context.moveTo(i*dx, j*dy);
      			context.lineTo((i+1)*dx, j*dy);
			}
			context.stroke();
		}
	}
	
	//
	//only if myDisp
	//
	if (myDisp.length > 2){
		//Prepare myDisp
		//myDisp is a single vector
		var myDispAdj = []
		for(var i = 0 ; i < myDisp.length ; i+=2){
			myDispAdj.push([myDisp[i],myDisp[i+1]]);
		}
		//convert to array
		var myDispAdjA = List2Array(myDispAdj,nelx+1,nely+1)
		console.log(myDispAdjA);
		//
		//after case 
		//
		for (var i = 0 ; i < nelx + 1 ; i++){
			for (var j = 0 ; j < nely + 1 ; j++){
				context.beginPath();
				context.arc(i*dx + myDispAdjA[i][j][0], j*dy + myDispAdjA[i][j][1]*(-1), radius, 0, 2 * Math.PI, false);
				context.fillStyle = 'red';
				context.fill();
				context.strokeStyle = '#7f0000';
				//Draw edges vertical
				if(j<nely){
	      			context.moveTo(i*dx + myDispAdjA[i][j][0], j*dy + myDispAdjA[i][j][1]*(-1));
	      			context.lineTo(i*dx + myDispAdjA[i][j+1][0], (j+1)*dy + myDispAdjA[i][j+1][1]*(-1));
				}
				//Draw edges horizontal
				if(i<nelx){
	      			context.moveTo(i*dx + myDispAdjA[i][j][0], j*dy + myDispAdjA[i][j][1]*(-1));
	      			context.lineTo((i+1)*dx + myDispAdjA[i+1][j][0], j*dy + myDispAdjA[i+1][j][1]*(-1));
				}
				context.stroke();
			}
		}
	}
}


