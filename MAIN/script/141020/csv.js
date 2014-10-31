//
//Variables
//
var myArray;
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
        myArray = $.csv.toArrays(myCSV);
        console.log(myArray[0].length,myArray[1].length);
        console.log(myArray[0][0],myArray[50][50],myArray[100][100]);
    }   
}
function arrayToCanvasFunc(myArray,myCanvas,myContext){
    width = myCanvas.width;
    height = myCanvas.height;
    // create a new pixel array
    imageData = myContext.createImageData(width, height);

    //Set Pixel
    function setPixel(imageData, x, y, r, g, b, a) {
        index = (x + y * imageData.width) * 4;
        imageData.data[index+0] = r;
        imageData.data[index+1] = g;
        imageData.data[index+2] = b;
        imageData.data[index+3] = a;
    }
    // draw random dots
    for (i = 0; i < myArray[0].length; i++) {
        for (j = 0 ; j < myArray[1].length ; j++){
            //coordinates
            var x = j, y = i;
            if (myArray[i][j] == 1 ){
                var r = 0, g = 0, b = 0;
            }
            else if (myArray[i][j] == 0 || myArray[i][j] == undefined){
                var r = 255, g = 255, b = 255;
            }
        setPixel(imageData, x, y, r, g, b, 255); 
        }
    }

    // copy the image data back onto the canvas
    myContext.putImageData(imageData, 0, 0); // at coords 0,0
}


