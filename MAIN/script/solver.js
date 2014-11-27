//
//Variables
//
///////////
var div = 7;
var myNewCanvas;
var nelx = div;
var nely = div;
var myDensityMatrix = math.zeros(nelx, nely);
/////////// 
var penal = 3;
var E = 0.5, nu = 0.3;
var myDensity2Array = [];
var F = math.zeros(2*(nelx+1)*(nely+1) , 1);
var U = math.zeros(2*(nely+1)*(nelx+1) , 1);
var myEDOFList = [];
var myDispColorArray = [];
var myECoor = [];
var myNIndex = [];
var myDisp = [];
//
var myElementVMStress = [];
var myVMColorArray = [];
var myPrompt;
//
//
//
function elementDensityFunc(myDensityMatrix,div){

    //loop through matrix and check if value is zero
    for (var i = 0 ; i < div  ; i++){
        for (var j = 0 ; j < div ; j++){
            //Get Value
            var myDensity =  math.subset(myDensityMatrix, math.index(i, j));
            //check is zero
            if (myDensity == 0){
                myDensityMatrix = math.subset(myDensityMatrix, math.index(i, j), 0.001); 
            }
        }
    }
    return myDensityMatrix;
}
//
//
//
function KE(E,nu){
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
            //get x at current element
            var temp1 = math.subset(x, math.index(i-1, j-1)); 
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
    

    ///////////////////////// MODE 1 /////////////////////////////////////
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
    //////////////////////////////////////////////////////////////////////////


    /*
    ///////////////////////// MODE 2 /////////////////////////////////////
    //convert myKFree to sparse
    var myKFreeSparse =  numeric.ccsSparse(myKFree);
    //convert to LUP
    LUP = numeric.ccsLUP(myKFreeSparse);
    //get temp5
    var temp5 = numeric.ccsLUPSolve(LUP,myFFree);
    //replace freeDOF in U
    for (var q = 0 ; q < freeDOF.length; q++){
        U = math.subset(U, math.index(freeDOF[q], 0), temp5[q]);
    }
    ////////////////////////////////////////////////////////////////////////
    */

    return _.flatten(U._data, false);
    
}
//
//
//
function myBCFunc (nelx,nely,F){
    //cantileverd beam
    //replace value in F
    var myIndex = math.size(F)._data[0];
    /*
    F = math.subset(F, math.index(myIndex-1, 0), -1);
    F = math.subset(F, math.index(myIndex-3, 0), -1);
    F = math.subset(F, math.index(myIndex-5, 0), -1);
    F = math.subset(F, math.index(myIndex-7, 0), -1);
    F = math.subset(F, math.index(myIndex-9, 0), -1);
    F = math.subset(F, math.index(myIndex-11, 0), -1);
    F = math.subset(F, math.index(myIndex-13, 0), -1);
    F = math.subset(F, math.index(myIndex-15, 0), -1);
    */
    /////////F/////////
    
    
    F = math.subset(F, math.index(myIndex-1, 0), -1);
    F = math.subset(F, math.index(myIndex-3, 0), -1);
    F = math.subset(F, math.index(myIndex-5, 0), -1);







    /////////F/////////
    
    //supports (simple arrays)
    var fixedDOF = _.range((nelx +1) * 2);
    var allDOF = _.range(2*(nely+1)*(nelx+1));
    //diff big - small
    var freeDOF = _.difference(allDOF,fixedDOF);
    return [F,fixedDOF,freeDOF];
}
//
//Get 4x2 matrix per element
//
function myECoorFunc(nelx,nely,myNewCanvas){
    //
    //var nodes = (nelx+1)*(nely+1);
    var Xdiv = myNewCanvas.width / nelx ;
    var Ydiv = myNewCanvas.height / nely ;
    //
    var myNCoorList = [];
    //
    for (var i = 0 ; i < nelx+1 ; i++){
        for (var j = 0 ; j < nely+1 ; j++){
            myArray = [i*Xdiv,j*Ydiv];
            myNCoorList.push(myArray);
        }
    }
    //Get index of node per element
    //global variable
    for(var i = 1 ; i <= nelx ; i++){
        for(var j = 1 ; j <= nely ; j++){
            var n1 = (nely+1)*(i-1)+j;
            var n2 = (nely+1)* i   +j;
            var edof = [n1-1, n2-1, n2, n1];
            myNIndex.push(edof)
        }
    }
    //Now put these two together
    //loop through elements
    for (var i = 0 ; i < nelx*nely ; i++){
        var temp = math.matrix([myNCoorList[myNIndex[i][0]],myNCoorList[myNIndex[i][1]],myNCoorList[myNIndex[i][2]],myNCoorList[myNIndex[i][3]]]);
        myECoor.push(temp);
    }
//myECoor is now a list of matricies
return myECoor;
}
//
//get B matrix given csi,eta and 4x2 matrix
//
function myBFunc(csi,eta,myECoor){
    var N1csi = 1+eta,
    N2csi = -1*eta-1,
    N3csi = eta-1,
    N4csi = 1-eta,
    N1eta = 1+csi,
    N2eta = 1-csi,
    N3eta = csi-1,
    N4eta = -1*csi-1;
    var temp1 = math.matrix([[N1csi, N2csi, N3csi, N4csi], [N1eta, N2eta, N3eta, N4eta]]);
    var temp = math.multiply(1/4,temp1);
    var Je = math.multiply(temp,myECoor);
    var JeInv = numeric.inv(Je._data);
    var JeInvM = math.matrix(JeInv);
    var Btemp = math.multiply(JeInvM,temp);
    var B = math.matrix([
    [math.subset(Btemp, math.index(0, 0)),0,math.subset(Btemp, math.index(0, 1)),0,math.subset(Btemp, math.index(0, 2)),0,math.subset(Btemp, math.index(0, 3)),0],
    [0,math.subset(Btemp, math.index(1, 0)),0,math.subset(Btemp, math.index(1, 1)),0,math.subset(Btemp, math.index(1, 2)),0,math.subset(Btemp, math.index(1, 3))],
    [math.subset(Btemp, math.index(1, 0)),math.subset(Btemp, math.index(0, 0)),math.subset(Btemp, math.index(1, 1)),math.subset(Btemp, math.index(0, 1)),math.subset(Btemp, math.index(1, 2)),math.subset(Btemp, math.index(0, 2)),math.subset(Btemp, math.index(1, 3)),math.subset(Btemp, math.index(0, 3))]
    ]);
    return B;
}
//
//
//
function myStrainFunc (){ //deosn't return anything for now
    //get D matrix
    var temp = math.matrix([[1,nu,0],[nu,1,0],[0,0, (1-nu)/2]]);
    var D = math.multiply(E/(1-(math.pow(nu,2))) ,temp);


    //set gauss_x
    var gauss_x = [-1*(1/math.sqrt(3)) ,  1/math.sqrt(3)];

    //declare element strain and stress (3d matrix)
    var myStrain = [];
    var myStress = [];
    for (var i = 0 ; i < nelx*nely ; i++){
        var temp = math.zeros(3,1);
        myStrain.push(temp);
        myStress.push(temp);
    }
    

    //Loop through elements
    for (var i = 0 ; i < nelx*nely ; i++){
        //get de per element
        var de= math.matrix([
            [myDisp[myNIndex[i][0]*2]],
            [myDisp[myNIndex[i][0]*2+1]],
            [myDisp[myNIndex[i][1]*2]],
            [myDisp[myNIndex[i][1]*2+1]],
            [myDisp[myNIndex[i][2]*2]],
            [myDisp[myNIndex[i][2]*2+1]],
            [myDisp[myNIndex[i][3]*2]],
            [myDisp[myNIndex[i][3]*2+1]]
                ]);
        

        //Get B at all 4 integration points
        for (var k = 0 ; k < 2 ; k++){
            var csi = gauss_x[k];
            for (var j = 0 ; j < 2 ; j++){
                var eta = gauss_x[j];
                //Get B
                var B = myBFunc(csi,eta,myECoor[i]);
                //Calculate Strain
                var temp = math.multiply(B,de);
                myStrain[i] = math.add(myStrain[i],temp);
            }
        }
        //get average of element strain
        myStrain[i] = math.multiply(myStrain[i],1/4);
        //console.log(myStrain[i]._data)



        //////////Do something with strain



        //now calculate stress = De * strain
        myStress[i] = math.multiply(D,myStrain[i]);
        //[S11,S22,S12]
        //Calculate VonMises
        var myVM = myVonMises(myStress[i]);
        myElementVMStress.push(myVM);

    }
    
    //return myStrain;
}
//
//
//
function myCalculateFunction (){
    var myCalculateB = document.getElementsByName("myCalculateB")[0]; 

    myCalculateB.onmouseover = function (e){
        NProgress.configure({ parent: '#myProgressDiv' });
        //NProgress.inc(0.3);
        NProgress.configure({ minimum: 0.2});
        var delay=50;
        setTimeout(function(){
            NProgress.start(); 
            NProgress.inc(0.1);
            myPrompt.value = "Calculating";
        },delay);   
    }



    myCalculateB.onmousedown  = function (e){

        //Get time
        var myTime1 = new Date().getTime();
        // get KE
        var myKE = KE(E,nu);
        //  get x
        var x = elementDensityFunc(myDensityMatrix,div);
        console.log("this is x");
        console.log(x._data);
        
        // solver
        myDisp = [];
        myDisp = mySolver(nelx,nely,x,penal,myKE,U);
        console.log(myDisp);
        //populate myDispColorArray 
        
        VisDispFunc(myDisp);
        //This will populate myECoor - public variable
        myECoor = [];
        myECoorFunc(nelx,nely,myNewCanvas);
        //This will populate myElementVMStress
        myElementVMStress = [];
        myStrainFunc();
        console.log(myElementVMStress);
        //Do somthing with strain
        VisVMFunc(myElementVMStress);

        NProgress.done();
        //get time again
        var myTime2 = new Date().getTime();
        var myDuration = (myTime2 - myTime1)/1000;
        console.log("Time to compute " , myDuration , "seconds");
        


    }
}
//
//
//
function myVonMises(vector){
    var S1 = math.subset(vector, math.index(0, 0)),
        S2 = math.subset(vector, math.index(1, 0)),
        S12 = math.subset(vector, math.index(2, 0));
        //\sigma_v = \sqrt{\sigma_1^2- \sigma_1\sigma_2+ \sigma_2^2+3\sigma_{12}^2}
    var VonMises = math.sqrt( math.pow(S1,2) - S1*S2 + math.pow(S2,2) + 3*math.pow(S12,2) );
    return VonMises;
}