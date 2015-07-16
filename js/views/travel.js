/*
 *	Travel around from and to locations
 */


function drawTravelDirections() {
	if (playerActions.Travel.availableToPlayer && playerActions.Travel.actionEnabled) {
		var str = "<table class=\"pull-right\">";
		var playerInteralLocation = (player.currentInternalLocation != null) ? player.internalEnvironments[player.currentInternalLocation] : null;
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
				//give player ability to enter the city if possible
				if (i == 0 && j == 0 && getCurrentLocation().internalLocation != null) {
					if (player.currentInternalLocation == null) {
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doEnterInternalLocation(" + getCurrentLocation().internalLocation + ")\" ";
					}
					else {
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doExitInternalLocation()\" ";
					}
				}
				else if (playerInteralLocation != null) {
					str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doTravelToInternalLocation(" + getInternalLocationTowardsDirection(new Location(i, j), playerInteralLocation) + ")\" ";
				}
				else {
					str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"travelRelative(" + i + "," + j + ")\" ";
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
		//jqueryifyButtons(); //BE: IS THIS USED ANY MORE?  IF NOT DELETE IT.
		resizePageElements();
	}
}

function getArrowForDirection(location) {
    if (location.y == -1) {
		if (location.x == -1) {
			 return "id=\"doTravelNW\">NW";
		}
		if (location.x == 0) {
			return "id=\"doTravelN\">N";
		}
		if (location.x == 1) {
			return "id=\"doTravelNE\">NE";
		}
	}
	else if (location.y == 0) {
		if (location.x == -1) {
			 return "id=\"doTravelW\">W";
		}
		if (location.x == 0) {
			if (player.currentInternalLocation == null) {
				return "id=\"nop\"><span class=\"glyphicon glyphicon-plus\"></span>";
			}
			else if (player.currentInternalLocation != null) {
				return "id=\"nop\"><span class=\"glyphicon glyphicon-remove\"></span>";
			}
			return "id=\"nop\">&nbsp;";
		}
		if (location.x == 1) {
			return "id=\"doTravelE\">E";
		}
	}
	else if (location.y == 1) {
		if (location.x == -1) {
			 return "id=\"doTravelSW\">SW";
		}
		if (location.x == 0) {
			return "id=\"doTravelS\">S";
		}
		if (location.x == 1) {
			return "id=\"doTravelSE\">SE";
		}
	}
	throw "no arrow for direction location(" + location.x + "," + location.y + ")";
}

//BE: This should be renamed since we aren't using tables any more really
function redrawTablesAfterLocationChange() {
	redrawMaps();
	drawTravelDirections();
	drawInventoryTable();
	initializeActionDiv();
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