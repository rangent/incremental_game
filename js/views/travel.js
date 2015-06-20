/*
 *	Travel around from and to locations
 */


function drawTravelDirections() {
	if (playerActions.Travel.availableToPlayer && playerActions.Travel.actionEnabled) {
		var str = "<table>";
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
				//give player ability to enter the city if possible
				if (i == 0 && j == 0 && getCurrentLocation().settlement != null) {
					if (player.inInternalEnvironment == null) {
						str += "<td><button class=\"clearEvent\" onclick=\"doEnterSettlement(" + getCurrentLocation().settlement + ")\" ";
					}
					else {
						str += "<td><button class=\"clearEvent\" onclick=\"doExitSettlement()\" ";
					}
				}
				else {
					str += "<td><button class=\"clearEvent\" onclick=\"travelRelative(" + i + "," + j + ")\" ";
				}
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
			if (player.inInternalEnvironment == null && getCurrentLocation().settlement != null ) {
				return "id=\"nop\">+";
			}
			else if (player.inInternalEnvironment != null) {
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