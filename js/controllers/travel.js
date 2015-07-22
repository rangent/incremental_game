/*
 * Travel controller
 */


/**
 * @param {Location} location : location to send player to
 */
function travelToLocation(location) {
    debugger; //is this function even used?
	player.currentLocation = location;
}


/**
 * @param {Location} location
 */
function isDirectionTraversable(location, internalLocation) {
	
	if (internalLocation != null) {
		return isInternalLocationTraversable(location, internalLocation);
	}
	
	var dx = location.x;
	var dy = location.y;
	var x = player.currentLocation.x + dx;
	var y = player.currentLocation.y + dy;
	var loc = player.availableTerrain[y][x];
	
	//maybe we want to do a special action with the center travel button eventually
	if (dx == 0 && dy == 0) {
		if (getTerrainAtCurrentLocation().internalLocation != null) {
			return true;
		}
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

function isInternalLocationTraversable(location, internalLocation) {
	var f = getInternalLocationTowardsDirection(location, internalLocation);
	return "undefined" !== f && null != f;
}

function getInternalLocationTowardsDirection(location, internalLocation) {
	if (location.y == -1) {
		if (location.x == -1) {
			 return internalLocation.directions.northwest;
		}
		if (location.x == 0) {
			return internalLocation.directions.north;
		}
		if (location.x == 1) {
			return internalLocation.directions.northeast;
		}
	}
	else if (location.y == 0) {
		if (location.x == -1) {
			 return internalLocation.directions.west;
		}
		if (location.x == 0) {
			return internalLocation.location;
		}
		if (location.x == 1) {
			return internalLocation.directions.east;
		}
	}
	else if (location.y == 1) {
		if (location.x == -1) {
			 return internalLocation.directions.southwest;
		}
		if (location.x == 0) {
			return internalLocation.directions.south;
		}
		if (location.x == 1) {
			return internalLocation.directions.southeast;
		}
	}
	throw "no arrow for direction location(" + location.x + "," + location.y + ")";
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
function updatePlayerCurrentLocation(x, y) {
	player.currentLocation = new Location(player.currentLocation.x + x, player.currentLocation.y + y);
}

function updatePlayerCurrentInternalLocation(internalLocationIndex) {
	player.currentInternalLocation = internalLocationIndex;
	getCurrentInternalLocation().explored = true;
}
