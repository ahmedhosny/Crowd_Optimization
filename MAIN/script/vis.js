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

function VisDispFunc (U,myDispCanvas){
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
	myRainbow.setSpectrum('blue', 'red');
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

