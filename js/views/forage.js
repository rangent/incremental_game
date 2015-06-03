/*
 *	forage views!
 */
function doForage() {
	closeJoyrideTips();	
	// progressStory(1); //second phase of the game
	//debugger;
	var i = resolveActionOnTerrain("Forage", getCurrentLocation());
	if (i != null) {
		addJoyrideTip(replaceAll("%ITEM%",i.item, constants.ITEM_FOUND_TIP));
		addItemsToInventory(getCurrentLocation().location, i.item, i.count);
		drawInventoryTable();
		updateCategoryTreeUi();
		letsJoyride(i.item);
	}
	else {
		//TODO: what else to do?  I dont like pushing failures to the log
		if ($(".logline:eq(0)").text().match("^Didn't find anything while foraging")) {
			logAppendNoSave(".");
		}
		else {
			// debugger;
			logNoSave("Didn't find anything while foraging.");
		}
	}

}
