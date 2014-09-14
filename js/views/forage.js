/*
 *	forage views!
 */
function doForage() {
	closeJoyrideTips();	
	// progressStory(1); //second phase of the game
	var i = resolveActionOnTerrain("Forage", player.currentTerrain);
	if (i != null) {
		addJoyrideTip(replaceAll("%ITEM%",i.item, constants.ITEM_FOUND_TIP));
		addItemsToInventory(player.currentTerrain, i.item, i.count);
		drawInventoryTable();
		letsJoyride(i.item);
	}
	else {
		if ($(".logline:eq(0)").text().match("^Didn't find anything while foraging")) {
			logAppendNoSave(".");
		}
		else {
			// debugger;
			logNoSave("Didn't find anything while foraging.");
		}
	}

}
