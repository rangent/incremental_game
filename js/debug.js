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