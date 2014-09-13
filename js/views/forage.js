/*
 *	forage views!
 */
function doForage() {
	closeJoyrideTips();	
	// progressStory(1); //second phase of the game
	var i = resolveActionOnTerrain("forage", player.currentTerrain);
	if (i != null) {
		log("You found " + i.count + " x " + i.item + " while foraging!");
		addItemsToInventory(player.currentTerrain, i.item, i.count);
		drawInventoryTable();
	}
	else {
		if ($(".logline:eq(0)").text().match("^Didn't find anything while foraging")) {
			logAppend(".");
		}
		else {
			logNoSave("Didn't find anything while foraging.");
		}
	}
	
}
