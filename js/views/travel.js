/*
 *	Travel around from and to locations
 */


function drawTravelDirections() {
	if ( (DEBUG && isGameRecording() ) ||
		(playerActions.Travel.availableToPlayer && playerActions.Travel.actionEnabled)) {
		var str = "<table class=\"pull-right\">";
		var playerInteralLocation = (isPlayerInInternalLocation()) ? player.internalEnvironments[player.currentInternalLocation] : null;
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
				//give player ability to enter the city if possible
				if (i == 0 && j == 0 && getTerrainAtCurrentLocation().internalLocation != null) {
					if (player.currentInternalLocation == null) {
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doEnterInternalLocation(" + getTerrainAtCurrentLocation().internalLocation + ")\" ";
					}
					else {
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doExitInternalLocation()\" ";
					}
				}
				else if (playerInteralLocation != null) {
					if (DEBUG && isGameRecording()) {
						//need to do something here conditionally add "recording" logic
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doRecordedTravel('" + getDirectionFromRelativeLocation(new Location(i, j)) + "')\" ";
					} else {
						str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"doTravelToInternalLocation(" + getInternalLocationTowardsDirection(new Location(i, j), playerInteralLocation) + ")\" ";
					}
				}
				else {
					str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"travelRelative(" + i + "," + j + ")\" ";
				}
				
				if (!(DEBUG && isGameRecording()) && !isDirectionTraversable(new Location(i, j), playerInteralLocation)) {
					str += " disabled ";
				}
				str += getArrowForDirection(new Location(i, j), "doTravel") + "</button></td>";
			}
			str += "</tr>";
		}
		str += "</table>";
	
		//clear travelSection then append
		$("#travelSection").empty().append(str);
		resizePageElements();
	}
}

function getArrowForDirection(location, idString) {
    if (location.y == -1) {
		if (location.x == -1) {
			 return "id=\"" + idString + "NW\">NW";
		}
		if (location.x == 0) {
			return "id=\"" + idString + "N\">N";
		}
		if (location.x == 1) {
			return "id=\"" + idString + "NE\">NE";
		}
	}
	else if (location.y == 0) {
		if (location.x == -1) {
			 return "id=\"" + idString + "W\">W";
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
			return "id=\"" + idString + "E\">E";
		}
	}
	else if (location.y == 1) {
		if (location.x == -1) {
			 return "id=\"" + idString + "SW\">SW";
		}
		if (location.x == 0) {
			return "id=\"" + idString + "S\">S";
		}
		if (location.x == 1) {
			return "id=\"" + idString + "SE\">SE";
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
}