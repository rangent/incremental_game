/*
 *	Travel around from and to locations
 */


function drawTravelDirections() {
	if (playerActions.Travel.availableToPlayer && playerActions.Travel.actionEnabled) {
		var str = "<table>";
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
				str += "<td><button class=\"clearEvent\" onclick=\"travelRelative(" + i + "," + j + ")\" ";
				if (!isTerrainTraversable(new Location(i, j))) {
					str += " disabled ";
				}
				str += getArrowForDirection(new Location(i, j)) + "</button></td>";
			}
			str += "</tr>";
		}
		str += "</table>";
	
		//clear travelSection then append
		$("#travelSection").empty().append(str);
		jqueryifyButtons();
	}
}

/*
 * @param {Location} location
 */
function isTerrainTraversable(location) {
	var dx = location.x;
	var dy = location.y;
	var x = player.currentLocation.x + dx;
	var y = player.currentLocation.y + dy;
	var loc = player.availableTerrain[y][x];
	
	//maybe we want to do a special action with the center travel button eventually
	if (dx == 0 && dy == 0) {
		return false;
	}
	//dont want to let player fall of the map
	else if (x < 0 || x >= constants.MAP_WIDTH || y < 0 || y >= constants.MAP_HEIGTH) {
		return false;
	}
	else if (loc.water) {
		return false; //not until we get proper "ship" or something that lets us cross water
	}
	return true; //TODO: restrict movement
}


function getArrowForDirection(location) {
    if (location.y == -1) {
		if (location.x == -1) {
			 return "id=\"doTravelNW\">&#x2196;";
		}
		if (location.x == 0) {
			return "id=\"doTravelN\">&#x2191;";
		}
		if (location.x == 1) {
			return "id=\"doTravelNE\">&#x2197;";
		}
	}
	else if (location.y == 0) {
		if (location.x == -1) {
			 return "id=\"doTravelW\">&#x2190;";
		}
		if (location.x == 0) {
			return "id=\"nop\">X";
		}
		if (location.x == 1) {
			return "id=\"doTravelE\">&#x2192;";
		}
	}
	else if (location.y == 1) {
		if (location.x == -1) {
			 return "id=\"doTravelSW\">&#x2199;";
		}
		if (location.x == 0) {
			return "id=\"doTravelS\">&#x2193;";
		}
		if (location.x == 1) {
			return "id=\"doTravelSE\">&#x2198;";
		}
	}
}

function discoverLandAroundLocation(location) {
	for (var j = -1; j <= 1; j++) {
		for (var i = -1; i <= 1; i++) {
			var x = location.x + i;
			var y = location.y + j;
			if (y >= 0 && y < constants.MAP_HEIGHT && x >= 0 && x < constants.MAP_WIDTH) {
				player.availableTerrain[y][x].explored = true;
			}
		}
	}
}


/*
 * primary travel function called by clicking direction button
 */
function travelRelative(x, y) {
	player.currentLocation = new Location(player.currentLocation.x + x, player.currentLocation.y + y);
	discoverLandAroundLocation(player.currentLocation);
	redrawMaps();
	drawTravelDirections();
	updateCurrentTerrain();
	drawInventoryTable();
}

/*
function doTravel() {
	var selectedTerrainId = $("#availableTerrain").select2("val");
	if (selectedTerrainId != "" && selectedTerrainId != player.currentLocation) {
		doTravelToLocation(parseInt(selectedTerrainId));
	}
}
*/


/*
 * @param {Location} terrainLocation : location to move the player to
 */
/* NEEDS COMPLETE OVERHAUL, doesn't make sense any more?
function doTravelToLocation(terrainLocation) {
	//logic to "enable" currently selected drop down item if it wasn't the  "select travel destination" item
	//also remove the "* " indicating the player's current location
	if (typeof getCurrentLocation() === "object") {
		getCurrentLocation().disabled = false;
		getCurrentLocation().text = getCurrentLocation().text.substring(2);
	}

	travelToLocation(terrainLocation);
	updateCurrentTerrain();
	getCurrentLocation().text = "* " + getCurrentLocation().text;
	$("#availableTerrain").select2("val", "");
	$("#selectedTerrain").empty();

	//TODO disable travel buttons under certain conditions?
	drawInventoryTable();
}
*/

/*
function travelLeft() {
	if ((player.currentLocation - 1) >= 0  && 
		typeof player.availableTerrain[player.currentLocation - 1] === "object") {
		doTravelToLocation(parseInt(player.currentLocation) - 1);
	}
}
*/


/*
function checkIfDisableLeftTravelButton() {
	if (player.currentLocation == 0) {
		disableButton("doTravelLeft");
	}
	else {
		enableButton("doTravelLeft");
	}
}
*/

/*
function travelRight() {
	if ((player.currentLocation + 1) < (player.availableTerrain.length)  && 
		typeof player.availableTerrain[player.currentLocation + 1] === "object") {
		doTravelToLocation(parseInt(player.currentLocation) + 1);
	}
}
*/

/*
function checkIfDisableRightTravelButton() {
	if (player.availableTerrain.length == 0 || player.currentLocation == (player.availableTerrain.length - 1)) {
		disableButton("doTravelRight");
	}
	else {
		enableButton("doTravelRight");
	}
}
*/