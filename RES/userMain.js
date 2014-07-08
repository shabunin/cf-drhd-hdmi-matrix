var myMatrix = DrHD_Matrix('DrHD', 'DrHDFeedBack', function() {
	CF.setJoin('s1', myMatrix.outputs[1].selectedInput + '\n' + myMatrix.outputs[1].enableOutput);
	CF.setJoin('s2', myMatrix.outputs[2].selectedInput + '\n' + myMatrix.outputs[2].enableOutput);
	CF.setJoin('s3', myMatrix.outputs[3].selectedInput + '\n' + myMatrix.outputs[3].enableOutput);
	CF.setJoin('s4', myMatrix.outputs[4].selectedInput + '\n' + myMatrix.outputs[4].enableOutput);
	CF.setJoin('s5', myMatrix.outputs[5].selectedInput + '\n' + myMatrix.outputs[5].enableOutput);
	CF.setJoin('s6', myMatrix.outputs[6].selectedInput + '\n' + myMatrix.outputs[6].enableOutput);
	CF.setJoin('s7', myMatrix.outputs[7].selectedInput + '\n' + myMatrix.outputs[7].enableOutput);
	CF.setJoin('s8', myMatrix.outputs[8].selectedInput + '\n' + myMatrix.outputs[8].enableOutput);
} );

CF.userMain = function () {
	
	myMatrix.startUp();
}