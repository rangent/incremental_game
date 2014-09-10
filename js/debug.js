function ftest1() {
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

	sleep((DEBUG) ? time += 20 : time += 100,addItemsToInventory, 'player', "Apple", 10);
	sleep((DEBUG) ? time += 20 : time += 100,addItemsToInventory, 0, "Stone", 3);
	sleep((DEBUG) ? time += 20 : time += 100,drawInventoryTable);

}

function testDoExplore() {
	$("#doExplore").click();
}

function testDoForage() {
	$("#doForage").click();
}