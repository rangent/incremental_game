/*
 *	View for locations
 */

/*
 *  Update the currently selected terrain in the UI
 *	@terrain : terrain 
 */
function updateTerrainTable(terrain) {
	$("#selectedTerrain").empty();
	var features = "None";
	if (terrain.terrainFeatures.length > 0) {
		features = "";
		for (var t in terrain.terrainFeatures) {
			features += terrain.terrainFeatures[t].tfname + " ";
		}
	}
	var modifiers = "None";
	if (terrain.terrainModifiers.length > 0 ) {
		modifiers = "";
		for (var t in terrain.terrainModifiers) {
			modifiers += "<a title=\""+ terrain.terrainModifiers[t].description + "\" class=\"tooltip\">" + terrain.terrainModifiers[t].tmname + "</a> ";
		}
	}
	var terrainPrintedName = terrain.terrainType.ttname;
	if (terrain.isHome) {
		terrainPrintedName += " (Home)";
	}

	var s = constants.TERRAIN_TABLE
		.replace("%TERRAIN_NAME%", terrainPrintedName)
		.replace("%FEATURES%",features)
		.replace("%MODIFIERS%",modifiers);

	$("#selectedTerrain").append(s);
	$(".tooltip").tooltip();
}

function updateLocationTextBasedOnPlayersLocation() {
	player.availableTerrain[player.currentTerrain].text = "* " + player.availableTerrain[player.currentTerrain].text;
}