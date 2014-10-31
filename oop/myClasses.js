//
//myImg class
//
function myImg(array,subDX,subDY){
	this.width = array.length[0];
	this.height = array.length[1];
	this.subDX = subDX;
	this.subDY = subDY;
	this.materialPercentage;
	//
	this.subImg ;
	this.subImage.width = this.width / this.subDX;
	this.subImage.height = this.height / this.subDY;
	this.subImg.materialPercentage; //can borrow material from other subimages
}
myImg.prototype.getImgMaterialPercentage = function(){
	var myPercentage;
	//get material % from image - this is fixed
	this.materialPercentage = myPercentage;
}
myImg.prototype.divide = function(){
	var mySubImgs = [];
	//code divide into subImg, use this.subImage.width and this.subImage.length
	this.subImg = mySubImgs;
}
myImg.subImg.prototype.getsubImgMaterialPercentage = function(){
	var myPercentage;
	//get material % from subimage - this can change, but image % cant
	this.subImg.materialPercentage = myPercentage;
}
myImg.prototype.getFiniteElements = function(DX,DY){
	//elements aggregated by pixels
}
myImg.prototype.solve = function(){
	
	//send to solver
}
//
//myDomain Class
//
function myDomain(Img,subImg){
	this.img = img;
	this.subImg = subImg;
	this.width = subImg.width;
	this.height = subImg.height;
	this.materialPercentage;
}
myDomain.prototype.draw = function(ctx){
	// CTX  - draw myDomain.img
}
//
//myUser class
//
function myUser(ID){
	this.ID = name;
	this.score;
	this.time;
}
myUser.prototype.play = function(mySubDomain){
	this = myDomain.User;
}

