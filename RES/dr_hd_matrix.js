var DrHD_Matrix = function (sysName, feedBackName, callback) {
	var module = {
		sysName: '',
		feedBackName: '',
		outputs: [],
		inputs: [],
		debug: 1,
		tmpStr: '',
	};

	module.regexp = {
		edidState : 	/(\d\d)\t\t(DEFAULT|OUTPUT )_(\d\d)\t(Yes |No)/,
		outputState: 	/(\d\d)\t\t(\d\d)\t\t(Yes |No)\t\t(Yes |No)/,
		selectedInput: 	/\[SUCCESS\]Set output (\d\d) connect from input (\d\d)/,
		outputPower: 	/\[SUCCESS\]Set output (\d\d) (ON|OFF)/,
		defaultEDID: 	/\[SUCCESS\]Set input (\d\d) edid with default edid (\d\d)./,
		copyEDID: 		/\[SUCCESS\]Copy output (\d\d) edid to input (\d\d)./
	}
	module.callback = callback;
	module.sysName = sysName;
	module.feedBackName = feedBackName;

	module.log = function (text) {
		if (module.debug == 1) {
			CF.log('>>>>  ' + module.sysName + ': ' + text);
		}
	};
	module.startUp = function () {
		module.log('Starting Up.');
		CF.watch(CF.FeedbackMatchedEvent, module.sysName, module.feedBackName, module.parseFeedBack); 
		module.getStatus();
	};

	module.getStatus = function () {
		module.log('Sending STATUS cmd.');
		CF.send(module.sysName, 'STATUS\x0D', CF.BINARY);
		module.tmpStr = '';
		
	};

	module.assignOut = function(output, input) {
		module.log('Assign out ' + output + ' from input ' + input);
		CF.send(module.sysName, 'OUT 0' + output + ' FR 0' + input + '\x0D', CF.BINARY);
	};

	module.powerOut = function(output, power) {
		//power - 'ON' or 'OFF'
		module.log('Power ' + output + ' ' + power);
		CF.send(module.sysName, 'OUT 0' + output +  ' ' + power + '\x0D', CF.BINARY);
	};
	module.copyEDID = function(input, output){
		module.log('Set input ' + input + ' EDID from output ' + output);
		CF.send(module.sysName, 'EDID 0' + input +  ' CP 0' + output + '\x0D', CF.BINARY);
	};
	module.defaultEDID = function(input, edidIndex) {
		edidIndexStr = edidIndex < 10 ? '0' + edidIndex : edidIndex;
		module.log('Set input ' + input + ' default EDID: ' + edidIndexStr);
		CF.send(module.sysName, 'EDID 0' + input +  ' DF ' + edidIndexStr + '\x0D', CF.BINARY);	
	};
	module.parseFeedBack = function(itemName, inputString) {
		module.log('Parsing FeedBack.');
		var regArr;
		module.tmpStr += inputString;
		if(inputString.indexOf('Matrix-8x8>') > 0 ) {
			module.log(module.tmpStr);

			var tmpInArr = module.tmpStr.split('\r\n');
			for(var i = 0, imax = tmpInArr.length; i<imax; i += 1) {
				
				// check if we get states of outputs
				if (module.regexp.outputState.test(tmpInArr[i])) {
					regArr = module.regexp.outputState.exec(tmpInArr[i]);
					//module.log(tmpInArr[i]);
					//module.log(regArr);
					var outNum = parseInt(regArr[1]);
					
					module.outputs[outNum] = {};
					module.outputs[outNum].selectedInput = parseInt(regArr[2]);
					module.outputs[outNum].cableConnect = regArr[3].indexOf('Yes')>= 0 ? 'ON': 'OFF';
					module.outputs[outNum].enableOutput = regArr[4].indexOf('Yes')>= 0 ? 'ON': 'OFF';
					//module.log(JSON.stringify(module.outputs[outNum]));
				}

				// check if we get states of inputs(EDID)
				if (module.regexp.edidState.test(tmpInArr[i])) {
					regArr = module.regexp.edidState.exec(tmpInArr[i]);
					//module.log(tmpInArr[i]);
					module.log(regArr);
					var inNum = parseInt(regArr[1]);
					
					module.inputs[inNum] = {};
					module.inputs[inNum].edidType = regArr[2];
					module.inputs[inNum].edidIndex = parseInt(regArr[3]);
					module.inputs[inNum].cableConnect = regArr[4].indexOf('Yes') >= 0 ? 'ON': 'OFF';
					
					//module.log(JSON.stringify(module.inputs[inNum]));
				}

				// check if we get changed selectedInput
				if (module.regexp.selectedInput.test(tmpInArr[i])) {
					regArr = module.regexp.selectedInput.exec(tmpInArr[i]);
					//module.log(tmpInArr[i]);
					//module.log(regArr);
					var outNum = parseInt(regArr[1]);
					module.outputs[outNum].selectedInput = parseInt(regArr[2]);
				}
				// check if we get changed power state of output
				if (module.regexp.outputPower.test(tmpInArr[i])) {
					regArr = module.regexp.outputPower.exec(tmpInArr[i]);

					var outNum = parseInt(regArr[1]);
					module.outputs[outNum].enableOutput = regArr[2];
				}
				// check if we get changed default edid
				if (module.regexp.defaultEDID.test(tmpInArr[i])) {
					regArr = module.regexp.defaultEDID.exec(tmpInArr[i]);
					//module.log(regArr);
					//module.log(JSON.stringify(module.inputs[inNum]));
					var inNum = parseInt(regArr[1]);
					module.inputs[inNum].edidType = 'DEFAULT';
					module.inputs[inNum].edidIndex = regArr[2];					
				}
				if (module.regexp.copyEDID.test(tmpInArr[i])) {
					regArr = module.regexp.copyEDID.exec(tmpInArr[i]);
					//module.log(regArr);
					//module.log(JSON.stringify(module.inputs[inNum]));
					var inNum = parseInt(regArr[2]);

					module.inputs[inNum].edidType = 'OUTPUT';
					module.inputs[inNum].edidIndex = regArr[1];					
				}

			}
			module.tmpStr = '';
			module.callback();
		}
	};
	return module;
}


/*================================================================
HDMI Matrix-8x8 Help Info
FW Version: 1.87

============= System Information Command
? Print Help Information
HELP Print Help Information
STATUS Print System Status And Port Status
============= System Control Command
PON Power On, System Run On Normal State
POFF Power Off, System Run On Power Save State
IR ON/OFF Set System IR Control On Or Off
KEY ON/OFF Set System KEY Control On Or Off
APM ON/OFF Set Advanced Process Mode On Or Off
BEEP ON/OFF Set Onboard Beep On Or Off
RESET Reset System To Default Setting
(Should Type "Yes" To Confirm, "No" To Discard)
============= Input And Output Port Control Command
OUT xx ON/OFF Set OUTPUT:xx On Or Off
OUT xx FR yy Set OUTPUT:xx From INPUT:yy
xx=00: Select All OUTPUT Port
xx=[01...08]: Select One OUTPUT Port
yy=[01...08]: Select One INPUT Port

EDID xx CP yy Set Input:xx EDID Copy From Output:yy
EDID xx DF zz Set Input:xx EDID To Default EDID:zz
xx=00: Select All INPUT Port
xx=[01...08]: Select One INPUT Port
yy=[01...08]: Select One OUTPUT Port
zz=00: HDMI 1080p@60Hz, Audio 2CH PCM
zz=01: HDMI 1080p@60Hz, Audio 5.1CH PCM/DTS/DOLBY
zz=02: HDMI 1080p@60Hz, Audio 7.1CH PCM/DTS/DOLBY/HD
zz=03: HDMI 1080i@60Hz, Audio 2CH PCM
zz=04: HDMI 1080i@60Hz, Audio 5.1CH PCM/DTS/DOLBY
zz=05: HDMI 1080i@60Hz, Audio 7.1CH PCM/DTS/DOLBY/HD
zz=06: HDMI 1080p@60Hz/3D, Audio 2CH PCM
zz=07: HDMI 1080p@60Hz/3D, Audio 5.1CH PCM/DTS/DOLBY
zz=08: HDMI 1080p@60Hz/3D, Audio 7.1CH PCM/DTS/DOLBY/HD
zz=09: HDMI 4K2K, Audio 2CH PCM
zz=10: HDMI 422K, Audio 5.1CH PCM/DTS/DOLBY
zz=11: HDMI 4K2K, Audio 7.1CH PCM/DTS/DOLBY/HD
zz=12: DVI 1280x1024@60Hz, Audio None
zz=13: DVI 1920x1080@60Hz, Audio None
zz=14: DVI 1920x1200@60Hz, Audio None
================================================================*/
