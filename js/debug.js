var travelLog = {
	recordedDirections : [],
	savedRecordings : [],
	};

function toggleRecording() {
	if (game.debug.recording) {
		game.debug.recording = false;
		//do stop-recording stuff
		outputRecordedDirections();
		drawTravelDirections();
		console.log("stopped recording");
	} else {
		game.debug.recording = true;
		//initialize the recorder
		travelLog["recordedDirections"] = [];
		drawTravelDirections();
		console.log("recording");
	}
}

/**
 * @param {String} direction : the cardinal direction to travel in
 */
function doRecordedTravel(direction) {
	travelLog["recordedDirections"].push(direction);
	quickstitchInternalEnvironment(getCurrentInternalLocation(),[direction]);
	doTravelToInternalLocation(getCurrentInternalLocation().directions[direction]);
}

function outputRecordedDirections() {
	var str = "SOME_NAME : [";
	for (var s in travelLog["recordedDirections"]) {
		str += "\"" + travelLog["recordedDirections"][s] + "\", ";
	}
	str = str.substring(0,str.length-2) + "],";
	console.log(str);
	travelLog["savedRecordings"].push(str);
}

function isGameRecording() {
	return game.debug.recording;
}

/*
function StonePickup () {
	$("#StonePickup").click();
}
function StoneDrop () {
	$("#StoneDrop").click();
}
function AppleDrop () {
	$("#AppleDrop").click();
}

function ftest1() {
	var CYCLES = 16;
	var time = 0;
	//initial explore
	for (var i = 0; i < 10; i++) {
		sleep((DEBUG) ? time += 20 : time += 100,testDoExplore);
	}

	//initial forage
	sleep((DEBUG) ? time += 1000 : time += 1000, testDoForage);

	//get us some lands
	for (var i = 0; i < 16; i++) {
		sleep((DEBUG) ? time += 20 : time += 100,testDoExplore);
	}

	//testing adding and removing items
	sleep((DEBUG) ? time += 20 : time += 100,addItemsToInventory, 'player', "Apple", 10);
	sleep((DEBUG) ? time += 20 : time += 100,addItemsToInventory, 0, "Stone", 3);
	sleep((DEBUG) ? time += 20 : time += 100,drawInventoryTable);

	for (var i = 0; i < 3; i++) {
		sleep((DEBUG) ? time += 20 : time += 100,StonePickup);
	}
	for (var i = 0; i < 3; i++) {
		sleep((DEBUG) ? time += 20 : time += 100,StoneDrop);
	}
	for (var i = 0; i < 3; i++) {
		sleep((DEBUG) ? time += 20 : time += 100,AppleDrop);
	}
	sleep((DEBUG) ? time += 20 : time += 100,StonePickup);
	sleep((DEBUG) ? time += 20 : time += 100,StonePickup);

	//move and drop
	for (var i = 0 ; i < Math.floor(CYCLES / 6) ; i++ ) {
		sleep((DEBUG) ? time += 20 : time += 100,travelRight);
		sleep((DEBUG) ? time += 20 : time += 100,AppleDrop);
	}

	for (var i = 0 ; i < Math.floor(CYCLES / 6) ; i++ ) {
		sleep((DEBUG) ? time += 20 : time += 500,travelLeft);
	}

	//2 more for good measure... (should be disabled)
	sleep((DEBUG) ? time += 20 : time += 500,travelLeft);
	sleep((DEBUG) ? time += 20 : time += 500,travelLeft);

	//test inventory max (shouldn't be able to go over)
	sleep((DEBUG) ? time += 20 : time += 100,addItemsToInventory, 'player', "Stone", 10);

	console.info("end!");
}

function testDoExplore() {
	$("#doExplore").click();
}

function testDoForage() {
	$("#doForage").click();
}
*/