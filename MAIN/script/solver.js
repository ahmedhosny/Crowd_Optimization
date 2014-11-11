//
//Variables
//
var nelx = 3;
var nely = 3;
var penal = 3;
var myDensity2Array = [];
var F = math.zeros(2*(nelx+1)*(nely+1) , 1);
var U = math.zeros(2*(nely+1)*(nelx+1) , 1);
var myEDOFList = [];
var myDispColorArray = [];
//
//
//
function elementDensityFunc(myCanvas,nelx,nely){
    var Xdiv = myCanvas.width / nelx;
    var Ydiv = myCanvas.height / nely;
    //get Pixel data  
    var myDensityArray = [];
    var context = myCanvas.getContext('2d');
    var interval = Xdiv * Ydiv;
    for (var j = 0 ; j < myCanvas.height  ; j += Ydiv){
        for (var i = 0 ; i < myCanvas.width ; i += Xdiv){
            //
            var myBlack = 0;
            var imageData = context.getImageData(i,  j, Xdiv, Ydiv);
            var data = imageData.data;
            //test ALL
            for (var k = 0; k < data.length; k += 4) {
                if (data[i] != 255 && data[i+1] != 255 && data[i+2] != 255){
                    myBlack += 1;
                }
            }
            //Check for singularity
            if(myBlack==0){
                myBlack = 0.001;
            }
            //
            var myDensity = myBlack/interval;
            myDensityArray.push(myDensity);
            //
        }
    }
    while(myDensityArray.length) myDensity2Array.push(myDensityArray.splice(0,nelx));
    return myDensity2Array;
}
//
//
//
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
return myK;
}
//
//
//
function mySolver(nelx,nely,x,penal,KE,U){
    //initaie K,F,U
    var K = math.zeros(2*(nelx+1)*(nely+1) , 2*(nelx+1)*(nely+1));
    //Covert x into math.matrix
    var xM = math.matrix(x);
    //console.log(U);
    //console.log(K);
    //console.log(F);
    //add x and penal to K
    for(var i = 1 ; i <= nelx ; i++){
        for(var j = 1 ; j <= nely ; j++){
            var n1 = (nely+1)*(i-1)+j;
            var n2 = (nely+1)* i   +j;
            var edof = [2*n1-2, 2*n1-1, 2*n2-2, 2*n2-1, 2*n2, 2*n2+1, 2*n1, 2*n1+1];
            //myEDOFList
            myTempVec = [];
            for (var z = 0 ; z < edof.length ; z++){
                myTempVec.push(edof[z])
            }
            myEDOFList.push(myTempVec)
            //
            var myKSub = []; //8x8 matrix subset from K
            for (var k = 0 ; k < edof.length ; k++){
                var myLine = [];
                for (var m = 0 ; m < edof.length ; m++){
                    var mySubset = math.subset(K, math.index(edof[k], edof[m]));
                    myLine.push(mySubset);
                }
                myKSub.push(myLine);
            }  
            //   
            //now we can use myKsub  
            var myKsubM = math.matrix(myKSub);
            //get xM at current element
            var temp1 = math.subset(xM, math.index(i-1, j-1)); 
            //raise that to the penal
            var temp2 = math.pow(temp1,penal);
            //multiply that to KE
            var temp3 = math.multiply(temp2,KE);
            //add that to myKsubM
            var temp4 = math.add(myKsubM,temp3);
            //
            //now return temp4 into K
            for (var n = 0 ; n < edof.length ; n++){
                for (var p = 0 ; p < edof.length ; p++){
                    //get value to add
                    var myAdd = math.subset(temp4, math.index(n, p));
                    //get original value
                    var myValue = math.subset(K, math.index(edof[n], edof[p]));
                    //add both to one another
                    var myFinal = math.add(myValue,myAdd);
                    //replace myFinal in K
                    K = math.subset(K, math.index(edof[n], edof[p]), myFinal); 
                }
            } 
        }
    }
    //now K is populated...

    //get free and fixed dofs + new F
    var DOF = myBCFunc (nelx,nely,F),
        fixedDOF = DOF[1],
        freeDOF = DOF[2]; 
    F = DOF[0];

    //Get freeDOF in K
    var myKFree = []; // matrix subset from K
    for (var r = 0 ; r < freeDOF.length ; r++){
        var myLine1 = [];
            for (var s = 0 ; s < freeDOF.length ; s++){
                var mySubset1 = math.subset(K, math.index(freeDOF[r], freeDOF[s]));
                myLine1.push(mySubset1);
            }
        myKFree.push(myLine1);
    }  
    //Get freeDOF in F
    var myFFree = [];
    for (var t = 0 ; t < freeDOF.length ; t++){
        var mySubset2 = math.subset(F, math.index(freeDOF[t], 0));
        myFFree.push(mySubset2);
    }
    //now we have myKFree and myFFree - both normal array of same length dimension
    //lets inverse myKFree
    var myKFreeInv = numeric.inv(myKFree);
    //convert myKfreeInv and myFFree to math matrix
    var myKFreeInvM =  math.matrix(myKFreeInv);
    var myFFreeM =  math.matrix(myFFree);
    //multiply F by K
    var temp5 = math.multiply(myFFreeM,myKFreeInvM);
    //replace freeDOF in U
    for (var q = 0 ; q < freeDOF.length; q++){
        U = math.subset(U, math.index(freeDOF[q], 0), temp5._data[q]);
    }
    return _.flatten(U._data, false);
}
//
//
//
function myBCFunc (nelx,nely,F){
    //cantileverd beam
    //replace value in F
    var myIndex = math.size(F)._data[0];
    F = math.subset(F, math.index(myIndex-1, 0), -1);/////////F/////////
    //supports (simple arrays)
    var fixedDOF = _.range((nelx +1) * 2);
    var allDOF = _.range(2*(nely+1)*(nelx+1));
    //diff big - small
    var freeDOF = _.difference(allDOF,fixedDOF);
    return [F,fixedDOF,freeDOF];
}
//
//
//
function myECoorFunc(nelx,nely,myCanvas){
    //
    var elements = nelx*nely;
    var Xdiv = myCanvas.width / nelx ;
    var Ydiv = myCanvas.height / nely ;
    //
    myCoorList = [];
    //
    for (var i = 0 ; i < nelx ; i++){
        for (var j = 0 ; j < nely ; j++){
            myArray = [i*Xdiv,j*Ydiv];
            myCoorList.push(myArray);
        }
    }
return myCoorList;
}
//
//
//
function myBFunc (csi,eta,eCoor){

/*
function [B] = myBFunction( csi, eta, myElementsCoor);
        N1csi = 1+eta;
        N2csi = -eta-1 ;
        N3csi = eta-1;
        N4csi = 1-eta;
        N1eta = 1+csi;
        N2eta = 1-csi;
        N3eta = csi-1;
        N4eta = -csi-1;
        temp = (1/4) * [N1csi, N2csi, N3csi, N4csi;...
                        N1eta, N2eta, N3eta, N4eta];
        Je = temp * myElementsCoor;
        Btemp = Je\temp;
        B = [Btemp(1,1), 0 ,Btemp(1,2), 0 , Btemp(1,3), 0 , Btemp(1,4) , 0;...
            0 , Btemp(2,1) , 0 , Btemp(2,2) , 0 , Btemp(2,3) , 0 , Btemp(2,4);...
            Btemp(2,1), Btemp(1,1), Btemp(2,2), Btemp(1,2), Btemp(2,3) , Btemp(1,3) , Btemp(2,4) , Btemp(1,4)];
    end 
*/

}
//
//
//
function myStrainFunc (myDisp){
    //get D matrix

    //set gauss_x
    //gauss_x = [-1*(1/sqrt(3)) ,  1/sqrt(3)] ;

    //declare element strain and stress
    //myElementStrain=zeros(3,1,m);
    //myElementStress=zeros(3,1,m);

    //loop through elements
    //get element disp from myDisp
    //myEDOFList

    //double loop to get csi and eta
    //for  k = 1:2
               // csi = gauss_x(1,k);
               // for j = 1:2
                  //  eta = gauss_x(1,j);

    //get B 
    //[B] = myBFunction( csi, eta, myElementsCoor(:,:,i));

    //get element strain
    //myElementStrain (:,:,i) = myElementStrain (:,:,i) + B * de';

    //exit loop

    //get average of element strain
    //myElementStrain (:,:,i) = myElementStrain (:,:,i) / 4;

    //get stress
    //myElementStress (:,:,i) = D * myElementStrain (:,:,i);

}
//
//
//
function myCalculateFunction (){
    var myCalculateB = document.getElementsByName("myCalculateB")[0]; 
    myCalculateB.onmousedown  = function (e){
        //Get time
        var myTime1 = new Date().getTime();
        // get KE
        var myKE = KE();
        //  get x
        var x = elementDensityFunc(myCanvas,nelx,nely);
        // solver
        var myDisp = mySolver(nelx,nely,x,penal,myKE,U);
        var myColorArray = VisDispFunc(myDisp);
        console.log(myColorArray);
        //get time again
        var myTime2 = new Date().getTime();
        var myDuration = (myTime2 - myTime1)/1000;
        console.log("Time to compute " , myDuration , "seconds");
        

        //console.log(myEDOFList);  
        //myCoorList  = myECoorFunc(nelx,nely,myCanvas);


    }
}

