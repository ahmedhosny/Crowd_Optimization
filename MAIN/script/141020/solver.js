//
//myCalculateFunction
//
function mySolver(nelx,nely,x,penal){

}

function KE(){
var E = 1.0, nu = 0.3;
var k=[ 1/2-nu/6 ,  1/8+nu/8 , -1/4-nu/12 , -1/8+3*nu/8 , -1/4+nu/12 , -1/8-nu/8 , nu/6 , 1/8-3*nu/8];
var temp = math.matrix([[k[0] , k[1] , k[2] , k[3] , k[4] , k[5] , k[6] , k[7]],
                        [k[1] , k[0] , k[7] , k[6] , k[5] , k[4] , k[3] , k[2]],
                        [k[2] , k[7] , k[0] , k[5] , k[6] , k[3] , k[4] , k[1]],
                        [k[3] , k[6] , k[5] , k[0] , k[7] , k[2] , k[1] , k[4]],
                        [k[4] , k[5] , k[6] , k[7] , k[0] , k[1] , k[2] , k[3]],
                        [k[5] , k[4] , k[3] , k[2] , k[1] , k[0] , k[7] , k[6]],
                        [k[6] , k[3] , k[4] , k[1] , k[2] , k[7] , k[0] , k[5]],
                        [k[7] , k[2] , k[1] , k[4] , k[3] , k[6] , k[5] , k[0]]
                         ]);

var myK = math.multiply(E/(1-Math.pow(nu,2)),temp);
//math.subset(myK, math.index(1, 0)); r then c
return myK.get;
}

function myCalculateFunction (){
var myCalculateB = document.getElementsByName("myCalculateB")[0];
//var mySVGs = document.getElementsByClassName("draggable")[0];  
    myCalculateB.onmousedown  = function (e){
        var myK = KE();
        console.log("hi");
        console.log(myK);
    }
}