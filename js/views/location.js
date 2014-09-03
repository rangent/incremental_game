/*
 *	View for locations
 */

/*
 *  Update the currently selected terrain in the UI
 *	@terrain : terrain 
 */
function updateTargetDestinationTable(terrain) {
	updateTerrainTable( $("#selectedTerrain"), terrain );
}

function updateCurrentTerrain() {
	updateTerrainTable( $("#currentTerrain") , player.availableTerrain[player.currentTerrain] );
	player.availableTerrain[player.currentTerrain].disabled = true;
}

/*
 * @divToContainTable : jQuery element : pass in the single element (selected by ID)
 * @terrain : Terrain
 */
function updateTerrainTable(divToContainTable, terrain) {
	divToContainTable.empty();
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
	if (terrain.id == player.currentTerrain) {
		terrainPrintedName = "* " + terrainPrintedName;
	}
	if (terrain.isHome) {
		terrainPrintedName += " (Home)";
	}

	var s = constants.TERRAIN_TABLE
		.replace("%TERRAIN_NAME%", terrainPrintedName)
		.replace("%FEATURES%",features)
		.replace("%MODIFIERS%",modifiers);

	divToContainTable.append(s);
	$(".tooltip").tooltip();
}

function updateLocationTextBasedOnPlayersLocation() {
	player.availableTerrain[player.currentTerrain].text = "* " + player.availableTerrain[player.currentTerrain].text;
}