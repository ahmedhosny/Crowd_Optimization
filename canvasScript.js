//
//myShape class (classes are functions)
//
function myShape(x, y, w, h, fill){
	//Constructor
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || "#AAAAAA";
}
var closeEnough = 7;
//
//Assign shape to context
//
myShape.prototype.draw = function(ctx){
	ctx.fillStyle = this.fill;
	ctx.fillRect(this.x,this.y,this.w,this.h);
}
//
// Find if point is inside shape but remove a a specific distance from each corner
//
myShape.prototype.contains = function(mx, my) {
  return  (this.x <= mx) && (this.x + this.w >= mx) &&
          (this.y <= my) && (this.y + this.h >= my) &&
         ((mx - this.x) > closeEnough) && ((this.x + this.w - mx) > closeEnough) &&
         ((my - this.y) > closeEnough) && ((this.y + this.h - my) > closeEnough);
}
//
//function to return hash
//
function point (x,y){
  return {x:x,y:y};
}
//
//function to calculate diatance between points
//
function distance(P1,P2){
  var myDistance = Math.sqrt ( (P2.x - P1.x) * (P2.x - P1.x)  + (P2.y - P1.y) * (P2.y - P1.y) );
  return myDistance;  
}
//
//Get where the user generates a mouse down
//
myShape.prototype.getHandle = function(mx,my){
  var mouse = point(mx,my),
  topLeft = point(this.x,this.y),
  bottomLeft = point(this.x, this.y + this.h),
  topRight = point(this.x + this.w, this.y),
  bottomRight = point(this.x + this.w, this.y + this.h); 
  if(distance(mouse,topLeft ) < closeEnough) return "topLeft";
  if(distance(mouse,bottomLeft ) < closeEnough) return "bottomLeft";
  if(distance(mouse, topRight) < closeEnough) return "topRight";
  if(distance(mouse, bottomRight ) < closeEnough) return "bottomRight";
  return false;
}


//
//Canvas state
//
function myCanvasState(canvas) {
  //Variables
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  //Our state flag
  this.valid = false; // false = the canvas will redraw everything
  this.shapes = [];  
  this.dragging = false;
  this.draggingTopLeft = false;
  this.draggingBottomLeft = false;
  this.draggingTopRight = false;
  this.draggingBottomRight = false;
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  //
  // Fix problems with Border or padding
  //
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  //
  // Fix problems with fixed-position bars 
  //
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;
  // Reference
  var myState = this;
  //
  //Avoid selecting text
  //
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  //
  //mouse down
  //
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    var l = shapes.length;
    for (var i = l-1; i >= 0; i--) {
      if (shapes[i].contains(mx, my)) {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        console.log("Rectangle has been moved");
        return;
      }
      else if(shapes[i].getHandle(mx,my) === "topLeft"){
        var mySel = shapes[i];
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.draggingTopLeft = true;
        myState.selection = mySel;
        myState.valid = false;
        console.log("topLeft selected");
        return;
      }
       else if(shapes[i].getHandle(mx,my) === "bottomLeft"){
        var mySel = shapes[i];
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.draggingBottomLeft = true;
        myState.selection = mySel;
        myState.valid = false;
        console.log("bottomLeft selected");
        return;
      }
       else if(shapes[i].getHandle(mx,my) === "topRight"){
        var mySel = shapes[i];
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.draggingTopRight = true;
        myState.selection = mySel;
        myState.valid = false;
        console.log("topRight selected");
        return;
      }
      else if(shapes[i].getHandle(mx,my) === "bottomRight"){
        var mySel = shapes[i];
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.draggingBottomRight = true;
        myState.selection = mySel;
        myState.valid = false;
        console.log("BottomRight selected");
        return;
      }
    }
    // if something is selected, then redraw
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; 
    }
  }, true);
  //
  //mousemove
  //
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      //refrence it back to the top left corner
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      // Something's dragging so we must redraw
      myState.valid = false; 
    }
    else if(myState.draggingTopLeft){
      var mouse = myState.getMouse(e);
      //refrence it back to the top left corner
      myState.selection.w += myState.selection.x - mouse.x; 
      myState.selection.h += myState.selection.y - mouse.y; 
      myState.selection.x = mouse.x ;
      myState.selection.y = mouse.y ;   
      // Something's dragging so we must redraw
      myState.valid = false; 
    }
    else if(myState.draggingBottomLeft){
      var mouse = myState.getMouse(e);
      //refrence it back to the top left corner
      myState.selection.w += myState.selection.x - mouse.x; 
      myState.selection.h = mouse.y - myState.selection.y; 
      myState.selection.x = mouse.x ;
      // Something's dragging so we must redraw
      myState.valid = false; 
    }
    else if(myState.draggingTopRight){
      var mouse = myState.getMouse(e);
      //refrence it back to the top left corner
      myState.selection.w = mouse.x - myState.selection.x ; 
      myState.selection.h += myState.selection.y - mouse.y ; 
      myState.selection.y = mouse.y ; 
      // Something's dragging so we must redraw
      myState.valid = false; 
    }
    else if(myState.draggingBottomRight){
      var mouse = myState.getMouse(e);
      //refrence it back to the top left corner
      myState.selection.w = mouse.x - myState.selection.x ; 
      myState.selection.h = mouse.y - myState.selection.y ; 
      // Something's dragging so we must redraw
      myState.valid = false; 
    }

  }, true);
  //
  //mouseup
  //
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
    myState.draggingTopLeft = false;
    myState.draggingBottomLeft = false;
    myState.draggingTopRight = false;
    myState.draggingBottomRight = false;
  }, true);
  // 
  //dblclick
  //
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new myShape(mouse.x - 75, mouse.y - 20, 150, 40, 'rgba(0,0,0,.6)'));
 console.log("new rectangle created")
  }, true);
  //
  //other Options 
  //
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

//
//Redraw when state is invalid
//
myCanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid ) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    
    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }
    //
    //Draw position handlers
    //
    if(this.draggingTopLeft){
      ctx.beginPath();
      //context.arc(x,y,r,sAngle,eAngle,counterclockwise);
      ctx.arc(100, 100, 5, 0, 2 * Math.PI);
      ctx.fillStyle="red";
      ctx.fill();
    }
    //
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    //
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
}
//
//Get mouse coordinates
//
myCanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

myCanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

myCanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

//Create instance of myCanvas state and pass it to canvas
 var s = new myCanvasState(document.getElementById('myCanvas'));
 document.getElementById("myCanvas").style.background = '#f1f1f1';
  // Lets make some partially transparent
  // s.addShape(new myShape(80,150,60,30, 'rgba(127, 255, 212, .5)'));
  

