//..................initialize required modules
var express = require('express');
var app=express();
var http=require('http');
var us = require("underscore");

var clientScore = [];
var clientCount = 0;

var myXMatrix = [[1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0],
                  [1.0,1.0,1.0,1.0,1.0,1.0,1.0]
                  ];
                 

//var myXMatrix = [[1,0.6],[1,0.6]];
                  

app.use(express.static(__dirname + '/public'));


var server = app.listen(process.env.PORT || 1337, function() {
    console.log('Listening on port %d', server.address().port);
});

//................................Socket.io
//initialize socket.io to listen to the same server as express
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  
  //get number of clients
  clientCount = findClientsSocket().length;
  console.log("connection established");
  console.log(findClientsSocket());

  //////////////////////////////////////////////////////////////


  /////////We need to emit the first x matrix to the socket that just connected
  socket.on('getFirstX', function(data){   
          socket.emit('firstX', myXMatrix);
          console.log("server emited firstX");
    });

    socket.on('userClicked', function(data){
          console.log(data);
          //broadcast will send to all except newly created connection
          //socket.broadcast.emit('newX', data);
          //emit will send to all
          //io.sockets.emit will send to all the clients
          myXMatrix = data.data._data;
          console.log(myXMatrix);
          //socket.broadcast.emit will send the message to all the other clients except the newly created connection
          io.sockets.emit('newX', myXMatrix);
          console.log("server emited newX to all");
    });

    //When the target density is reached
    socket.on('targertDensityReached', function(data){
          console.log('game over!');
          //now add each client with their id and score to clientScore
          // it looks something like this
          //  [ { id: 'Gk99VsINlRhgHD0CAAAA', score: 4.51 }, { id: 'j9jT54_dY1exUoNLAAAB', score: 0.82 } ]
          clientScore.push({id:socket.id, score:data.data})
          // avoid duplicates
          clientScore = us.uniq(clientScore, function(item, key, id) { return item.id; })

        

          // now we need to make sure that all sockets have logged in their scores
          // only if ClientScore.length is the same as clientCount

          if( parseInt(clientScore.length) == parseInt(clientCount)){
            console.log(clientScore);
            var winner = us.max(clientScore, function(clientScore){ return clientScore.score; });

            //send message to winner that he won
            io.sockets.connected[winner.id].emit('winner', 'some data');

            //now lets loop through losers and loop through it
            for (var i  = 0 ; i < clientScore.length ; i++){
              //get id
              var myID = clientScore[i].id;
                // if they are losers
                if ( myID != winner.id){
                    io.sockets.connected[myID].emit('loser', 'some data');
                }
                
            }
            //console.log(" ooooo!  winner is");
            //console.log(winner);
          }



    });




    //USERS

  socket.on("login", function(data) {
    var u=usersByName[data.name];
    if (u) {
      if (u.password==data.password) {
        var userpacket={name:u.name, id:u.id};
        socket.emit("loggedin", userpacket);        
        socket.broadcast.emit("userJoined", userpacket);
        u.socket=socket;
        socket.user=u;
      }
      else {
        socket.emit("loginFailed", {error:"wrong password"});
      }
    }
    else {
      u=new User(data.name, data.password, socket);
      var userpacket={name:u.name, id:u.id};
      socket.user=u;
      socket.emit("loggedin", userpacket);        
      socket.broadcast.emit("userJoined", userpacket);
      console.log("loggedin", userpacket);
    }
  });

  //when a client disconnects this message is received
  socket.on('disconnect', function(){
      if (socket.user) {
        var u=socket.user;      
        u.socket=null;
        var userpacket={id:u.id};
        socket.broadcast.emit("userLeft", userpacket);
        console.log("userLeft", userpacket);
        //recalculate number of clients
        clientCount = findClientsSocket().length;
        console.log(clientCount);
      }
  });
///////////////////////
  
});


var userid=1;
var usersById={};
var usersByName={};


function User(name, password, color, socket) {
    this.name=name;
    this.password=password;
    this.id=userid;
    this.color=color;
    this.socket=socket;

    usersById[this.id]=this;
    usersByName[this.name]=this;

    userid++;
}




///////////////////////////////////////////////////////////////

function findClientsSocket(roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}


