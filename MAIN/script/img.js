//
//Variables
//
var myImageURL;
//
//Read CSV function
//
function myIMGFunction (){
    var inputElement = document.getElementById("myUpload");
    inputElement.addEventListener("change",handleFiles, false);
    function handleFiles(e) { 
        var file = e.target.files[0];
        var reader = new FileReader();  
        console.log(file.name);
        reader.addEventListener("load", processfile, false); 
        reader.readAsDataURL(file);
    }
    
    function processfile(e){
        myImageURL= e.target.result;
        console.log("done!")
    }   
}
