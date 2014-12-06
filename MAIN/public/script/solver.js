//
//Variables
//
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// green #09b39c
// beige #e0cab1
// red #d43939
var div = 7;
var wholeDim = 315;
//[column,row]
var mySupport = [[2,0],[3,0],[4,0],[5,0],[2,1],[3,1],[4,1],[5,1]];
var myForce = [[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]];
var myForceMag = -1;
var myForceDir = 'y';
// change myBCsvg
// change initial matrix in app
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
var myNewCanvas;
var nelx = div;
var nely = div;
var myDensityMatrix = [];
var myDensityMatrixContainer = [];
//push one array
myDensityMatrixContainer.push(myDensityMatrix);
/////////// 
var penal = 3;
var E = 1.0, nu = 0.3;
var myDensity2Array = [];
var F = math.zeros(2*(nelx+1)*(nely+1) , 1);
var U = math.zeros(2*(nely+1)*(nelx+1) , 1);

var myDispColorArray = [];
var myECoor = [];
var myNIndex = [];
var myDisp = [];
//
var myElementVMStress = [];
var myVMColorArray = [];
var myPrompt;
var myBucket;
var myGuide;
var myGuide1;
var myGuide2;
//
var myCurrentStateIndex = 0;
//Flags
var myDuplicateFlag = false;
//
var myMaxDisp = 0.0;
var myMaxVM = 0.0;
var myCompliance = 0.0;
var myScores = []

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
                myDensityMatrix = math.subset(myDensityMatrix, math.index(i, j), 0.00000001); 
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


            //lets populate K here

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
            var temp1 = math.subset(x, math.index(j-1, i-1)); 
            //raise that to the penal
            var temp2 = math.pow(temp1,penal);
            //multiply that to KE
            var temp3 = math.multiply(temp2,KE);

            //
            //now return temp4 into K
            for (var n = 0 ; n < edof.length ; n++){
                for (var p = 0 ; p < edof.length ; p++){
                    //get value to add / picking here dosnt matter as the matrix is symmentrical
                    var myAdd = math.subset(temp3, math.index(p, n));
                    //get original value
                    var myValue = math.subset(K, math.index(edof[p], edof[n]));
                    //add both to one another
                    var myFinal = myValue + myAdd;
                    //replace myFinal in K
                    K = math.subset(K, math.index(edof[p], edof[n] ), myFinal); 
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
   // var myIndex = math.size(F)._data[0];


   // F = math.subset(F, math.index(myIndex-1, 0), myForceDir);

  
    /////////F/////////
    
    for (var i = 0 ; i < myForce.length ; i++){
        if (myForceDir == 'y'){
            var index = myForce[i][0]*(nelx+1)*2 + (myForce[i][1]*2) + 1;
            F = math.subset(F, math.index(index, 0), myForceMag);
        }
        else{
            var index = myForce[i][0]*(nelx+1)*2 + (myForce[i][1]*2);
            F = math.subset(F, math.index(index, 0), myForceMag);
        }
    }

    console.log(_.flatten(F._data, false));
    
    //supports (simple arrays)
    //get fixed dofs from mySupport
    var fixedDOF = []
    for (var i = 0; i < mySupport.length ; i++){
        fixedDOF.push(mySupport[i][0]*(nelx+1)*2 + mySupport[i][1]*2);
        fixedDOF.push(mySupport[i][0]*(nelx+1)*2 + (mySupport[i][1]*2) + 1);
    }

    var allDOF = _.range(2*(nely+1)*(nelx+1));
    //diff big - small
    var freeDOF = _.difference(allDOF,fixedDOF);
    //console.log(F);
    //console.log(fixedDOF);
    //console.log(freeDOF)
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

function myCalculateFunction (myBoolean, myBoolean2){
    //Get time
    var myTime1 = new Date().getTime();
    // get KE
    var myKE = KE(E,nu);
    //  get x
    var x = elementDensityFunc(myDensityMatrixContainer[myCurrentStateIndex],div);

    
    // solver
    myDisp = [];
    myDisp = mySolver(nelx,nely,x,penal,myKE,U);



    //Calculate compliance
    complainceFunc(F,myDisp);
    

    //  exagerate the displacement
    myDisp = myDisp.map( function(item) { return item * 5; } );

    //
    //get disp from vector
    myUList = XYtoVectorFunc(myDisp);
    myMaxDisp = _.max(myUList) ;
    //console.log(myMaxDisp);
    
    //populate myDispColorArray 
    
    VisDispFunc(myDisp);
    //This will populate myECoor - public variable
    myECoor = [];
    myECoorFunc(nelx,nely,myNewCanvas);
    //This will populate myElementVMStress
    myElementVMStress = [];
    myStrainFunc();
    //console.log(myElementVMStress);
    myMaxVM = _.max(myElementVMStress);
    
    //Do somthing with strain
    VisVMFunc(myElementVMStress);

    //


    myScores.push([myMaxDisp,myMaxVM,parseFloat(myCompliance)]);
    console.log(myScores);
    calculateScore();
    //

    NProgress.done();
    //get time again
    var myTime2 = new Date().getTime();
    var myDuration = (myTime2 - myTime1)/1000;

    console.log("Time to compute " , myDuration , "seconds");
    myPrompt.value = "Done!";
    if(myBoolean){

        //Add to container
        myDensityMatrixContainer.push(x);
        //console.log(myDensityMatrixContainer);

        //change options in stateMenu
        addOption();
    }


    //Now adjust select to last one in list
    //if automatically running
    if( myBoolean2){
        $("#stateMenu").val(myDensityMatrixContainer.length - 1);
        $('#stateMenu').selectmenu('refresh');
        myCurrentStateIndex = $( "#stateMenu" ).val();
    }
    //if not automatically running and I want to choose whatever I want
    else{

        // do nothing
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

//convert XY disp to vector
function XYtoVectorFunc (U){
    //Build a canvas that is nelx+1 and nely+1 pixels wide and high
    //get vector using Pythagoras
    var myUList = [];
    for (var i = 0 ; i < U.length ; i+=2){
        var A = U[i], B = U[i+1];
        var C = math.sqrt(math.pow(A,2) + math.pow(B,2));
        myUList.push(C);
    }
    return myUList;
}

//Calculate compliance , F is matrix, U is array (use myDisp)
function complainceFunc(F,U){
    //convert F to transpose
    var FT = math.transpose(F); 
    //console.log(FT);
    //create matrix from U
    var myUMatrix = math.matrix(U);
    //console.log(myUMatrix);
    //multiply them
    myCompliance = math.multiply(FT,myUMatrix);
    myCompliance = myCompliance.toFixed(7);
    //console.log(myCompliance);
}
function calculateScore(){
    //only it is not the first time this runs (it has two items or more)
    if (myScores.length > 1){
        //for Disp
        var myDispNew = 100*(myScores[myScores.length-1][0]-myScores[0][0])/myScores[0][0]
        if (myDispNew >= 0){
            myGuide.value = "+ " + Math.round(myDispNew*100)/100 + " %";
        }
        else{
            myGuide.value =  Math.round(myDispNew*100)/100 + " %";
        }
        //for VM
        var myVMNew = 100*(myScores[myScores.length-1][1]-myScores[0][1])/myScores[0][1]
        if (myVMNew >= 0){
            myGuide1.value = "+ " + Math.round(myVMNew*100)/100 + " %";
        }
        else{
            myGuide1.value =   Math.round(myVMNew*100)/100 + " %";
        }
        //for Compliance
        var myComplianceNew = 100*(myScores[myScores.length-1][2]-myScores[0][2])/myScores[0][2]
        if (myComplianceNew >= 0){
            myGuide2.value = "+ " + Math.round(myComplianceNew*100)/100 + " %";
        }
        else{
            myGuide2.value =  Math.round(myComplianceNew*100)/100 + " %";
        } 
    }
    else{

        myGuide.value = Math.round(myMaxDisp*100)/100;
        myGuide1.value = Math.round(myMaxVM*100)/100;
        myGuide2.value = Math.round(myCompliance*100)/100;
    }



}