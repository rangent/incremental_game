/*
 *	Travel around from and to locations
 */


function drawTravelDirections() {
	if (playerActions.Travel.availableToPlayer && playerActions.Travel.actionEnabled) {
		var str = "<table>";
		var playerInteralLocation = (player.currentInternalLocation != null) ? player.internalEnvironments[player.currentInternalLocation] : null;
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
				//give player ability to enter the city if possible
				if (i == 0 && j == 0 && getCurrentLocation().internalLocation != null) {
					if (player.currentInternalLocation == null) {
						str += "<td><button class=\"clearEvent\" onclick=\"doEnterInternalLocation(" + getCurrentLocation().internalLocation + ")\" ";
					}
					else {
						str += "<td><button class=\"clearEvent\" onclick=\"doExitInternalLocation()\" ";
					}
				}
				else if (playerInteralLocation != null) {
					str += "<td><button class=\"clearEvent\" onclick=\"doTravelToInternalLocation(" + getInternalLocationTowardsDirection(new Location(i, j), playerInteralLocation) + ")\" ";
				}
				else {
					str += "<td><button class=\"clearEvent\" onclick=\"travelRelative(" + i + "," + j + ")\" ";
				}
				
				if (!isDirectionTraversable(new Location(i, j), playerInteralLocation)) {
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
			if (player.currentInternalLocation == null) {
				return "id=\"nop\">+";
			}
			else if (player.currentInternalLocation != null) {
				return "id=\"nop\">X";
			}
			return "id=\"nop\">&nbsp;";
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
	throw "no arrow for direction location(" + location.x + "," + location.y + ")";
}

function redrawTablesAfterLocationChange() {
	redrawMaps();
	drawTravelDirections();
	drawInventoryTable();
}

/*
 * primary travel function called by clicking direction button
 */
function travelRelative(x, y) {
	updatePlayerCurrentLocation(x, y);
	discoverLandAroundLocation(player.currentLocation);
	redrawTablesAfterLocationChange();
	updateCurrentTerrain();
}


function doTravelToInternalLocation(internalLocationIndex) {
	updatePlayerCurrentInternalLocation(internalLocationIndex);
	redrawTablesAfterLocationChange();
	drawInternalLocationMap();
}