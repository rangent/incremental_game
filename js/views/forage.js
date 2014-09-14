/*
 *	forage views!
 */
function doForage() {
	closeJoyrideTips();	
	// progressStory(1); //second phase of the game
	var i = resolveActionOnTerrain("forage", player.currentTerrain);
	if (i != null) {
		log("While foraging you found: " + i.count + " x " + i.item);
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
