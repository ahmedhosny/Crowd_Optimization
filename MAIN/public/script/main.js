//line st
//var socket=io('http://192.168.1.142:1337');
//self
var socket=io('http://127.0.0.1:1337');

//$(document).ready(

//function () {
    //
    //get button , myMainBody ,myUserInfo , myUserName
    //
var mySubmit = document.getElementsByName("myButton")[0];
var myMainBody = document.getElementById("myMainBody");
var myUserInfo = document.getElementById("myUserInfo");
var myMatPer, myBucket, myOldPer;
var myAddFlag = false, myDeleteFlag = false;
var myNewPer = [3];
var myBucketValue = 0.0;
var myOriginalPer = 0.0;
var myUserName;
var myPlayer1temp;
var myPlayer2temp;
//
//when GO! clicked
//
mySubmit.onmousedown = function (e) {
    //get userName
    loginButtonClicked();
}



socket.on("loggedin", function(data){
    me=new User(data.name, data.id);
    /////////////////////
    //Only if user is valid
    ////////////////////
    //remover myUserInfo
    myUserInfo.parentNode.removeChild(myUserInfo);
    //things to run whe user hits go
    // ask server for first X matrix
    socket.emit('getFirstX',{});
    console.log("requesting first x from server")
    // when we get a reply, set it
    socket.on('firstX', function(data){
        console.log("received first X");
        console.log(data);
        //now we need to set the matrix to whatever we got here
        var myMatrix = math.matrix(data);
        console.log(myMatrix);
        //
        myDensityMatrixContainer[myCurrentStateIndex] = myMatrix;
        // run my game function
        myGameFunction(); 
        //This will calculate on the first time the game is opened
        var myBoolean = true;
        myCalculateFunction(myBoolean,myBoolean);
    });

});


socket.on("loginFailed", function(data){
    console.log(data);
    alert(data.error);    
});

socket.on("needToLogin", function(data){
    console.log(data);
    alert("login needed");
});


socket.on("userJoined", function(data){
    // If I am the first player
    if (data.length == 1){
       myPlayer1temp = data[0].name;
       myPlayer2temp = "not in yet";
    }

    else{
        myPlayer1temp = data[0].name;
        myPlayer2temp  = data[1].name;
    }
});





/////////////////////
//users
///////////////////

var me=null;

function User(name, id, color) {
    this.name=name;
    this.id=id;
}

function loginButtonClicked() {
    myUserName = document.getElementsByName("myUserName")[0].value;
    myUserPass = document.getElementsByName("myUserPass")[0].value;
    login(myUserName, myUserPass);
    console.log(" user info emitted fro client side");
}

function login(name, password) {
    socket.emit("login", {name:name, password:password});
}






socket.on("userLeft", function(data){
    console.log("LEFT:");
    console.log(data);
});


