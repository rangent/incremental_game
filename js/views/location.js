/*
 *	View for locations
 */

/*
 *  Update the currently selected terrain in the UI
 *	@terrain : terrain 
 */
/*
function updateTargetDestinationTable(terrain) {
	updateTerrainTable( $("#selectedTerrain"), terrain );
}
*/


function updateCurrentTerrain() {
	updateTerrainTable( $("#currentTerrain") , getCurrentLocation() );
	getCurrentLocation().disabled = true;
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
			features += "<a title=\""+ terrain.terrainFeatures[t].description + "\" class=\"tooltip\">" +  terrain.terrainFeatures[t].tfname + "</a>, ";
		}
		features = features.substring(0,features.length-2);
	}
	var modifiers = "None";
	if (terrain.terrainModifiers.length > 0 ) {
		modifiers = "";
		for (var t in terrain.terrainModifiers) {
			modifiers += "<a title=\""+ terrain.terrainModifiers[t].description + "\" class=\"tooltip\">" + terrain.terrainModifiers[t].tmname + "</a> ";
		}
	}
	var terrainPrintedName = terrain.terrainType.ttname;
	if (isSameLocation(terrain.location, player.currentLocation)) {
		terrainPrintedName = "* " + terrainPrintedName;
	}
	if (terrain.isHome) {
		terrainPrintedName += " (Home)";
	}
	var buildings = "None";
	var bldArr = terrain.buildings;
	if (bldArr.length > 0) {
		buildings = "";
		for (var i = 0; i < bldArr.length; i++) {
			buildings += bldArr[i].name + ", ";
		}
		buildings = buildings.substring(0,buildings.length-2);
	}

	var s = constants.TERRAIN_TABLE
		.replace("%TERRAIN_NAME%", terrainPrintedName)
		.replace("%FEATURES%",features)
		.replace("%MODIFIERS%",modifiers)
		.replace("%BUILDINGS%",buildings);

	divToContainTable.append(s);
	$(".tooltip").tooltip();
}

function updateLocationTextBasedOnPlayersLocation() {
	getCurrentLocation().text = "* " + getCurrentLocation().text;
}