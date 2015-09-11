/*
 *	scavenge views!
 */
function doScavenge() {
	closeJoyrideTips();	
	// progressStory(1); //second phase of the game
	//debugger;
	var i = resolveActionOnTerrain("Scavenge", getTerrainAtCurrentLocation());
	if (typeof i === "undefined") {
		logNoSave("Nothing can be achieved by trying to scavenge here.");
	} else if (i != null) {
		addJoyrideTip(replaceAll("%ITEM%",i.item, constants.ITEM_FOUND_TIP));
		addItemsToInventory(getTerrainAtCurrentLocation().location, i.item, i.count);
		drawInventoryTable();
		updateCategoryTreeUi();
		letsJoyride(i.item);
	} else {
		//TODO: what else to do?  I dont like pushing failures to the log
		if ($(".logline:eq(0)").text().match("^Didn't find anything while scavenging")) {
			logAppendNoSave(".");
		}
		else {
			// debugger;
			logNoSave("Didn't find anything while scavenging.");
		}
	}

}
