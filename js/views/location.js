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
	var currentPlace = (isPlayerInInternalLocation()) ? getCurrentInternalLocation() : getTerrainAtCurrentLocation();
	updateTerrainTable( $("#currentTerrain") , currentPlace );
	getTerrainAtCurrentLocation().disabled = true;
}


/*
 * @divToContainTable : jQuery element : pass in the single element (selected by ID)
 * @terrain : Terrain
 */
function updateTerrainTable(divToContainTable, currentPlace) {
	//BE: Refactor and remove all "Terrain" references if we can since it also applies to internal environments
	divToContainTable.empty();
	var features = "None";
	if (currentPlace.hasOwnProperty("terrainFeatures") && currentPlace.terrainFeatures.length > 0) {
		features = "";
		for (var t in currentPlace.terrainFeatures) {
			features += "<a title=\""+ currentPlace.terrainFeatures[t].description + "\" class=\"tooltip\">" +  currentPlace.terrainFeatures[t].tfname + "</a>, ";
		}
		features = features.substring(0,features.length-2);
	}
	var modifiers = "None";
	if (currentPlace.hasOwnProperty("terrainModifiers") && currentPlace.terrainModifiers.length > 0 ) {
		modifiers = "";
		for (var t in currentPlace.terrainModifiers) {
			modifiers += "<a title=\""+ currentPlace.terrainModifiers[t].description + "\" class=\"tooltip\">" + currentPlace.terrainModifiers[t].tmname + "</a> ";
		}
	}
	
	var terrainPrintedName = "";
	if (isPlayerInInternalLocation() && player.internalEnvironments[player.currentInternalLocation].isSettlement) {
		terrainPrintedName = getSettlementSizeName(player.internalEnvironments[player.currentInternalLocation]);
		if (currentPlace.hasOwnProperty("text") && currentPlace.text.length > 0) {
			terrainPrintedName += " " + currentPlace.text;
		}
	} else if (isPlayerInInternalLocation()) {
		terrainPrintedName = "INSIDE";
		if (currentPlace.hasOwnProperty("text") && currentPlace.text.length > 0) {
			terrainPrintedName = currentPlace.text;
		}
	} else if (currentPlace.hasOwnProperty("terrainType")) {
		terrainPrintedName = currentPlace.terrainType.ttname;
	}
	
	var buildings = "None";
	var bldArr = currentPlace.buildings;
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

function getCurrentLocation() {
	return player.currentLocation;
}

function updateLocationTextBasedOnPlayersLocation() {
	getTerrainAtCurrentLocation().text = "* " + getTerrainAtCurrentLocation().text;
}