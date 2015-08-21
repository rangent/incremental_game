
//////////////////////////////////////////////////////////////////////////////
// GAME'S START
//////////////////////////////////////////////////////////////////////////////

function setupNewGame() {
	if (!masterState.global.mapGenerated) {
		initializePlayerTerrainAsset();
		player.internalEnvironments = new Object();
		var ms = generateMap(constants.MAP_WIDTH, constants.MAP_HEIGHT);
		player.currentLocation = ms.start;
		game.seed = ms.map.seed;
		initializeMap(ms.map);
		establishSettledArea(player.currentLocation);
		enterInternalLocation(0);
		discoverLandAroundLocation(player.currentLocation);
		masterState.global.mapGenerated = true;
	}
}

function defineRuntimeConstants() {
	//need to define new constants since assets weren't defined until now :-/
	constants.ROOT_CATEGORY = new Category([], categoryNames.ROOT);
	globalCategories[0] = constants.ROOT_CATEGORY;
}

function initializePlayerTerrainAsset() {
	player.availableTerrain = new Array(constants.MAP_HEIGHT);
	for (var y = 0; y < player.availableTerrain.length; y++) {
		player.availableTerrain[y] = new Array(constants.MAP_WIDTH);
	}
}

$(document).keydown(function(e) {
	var il = getCurrentInternalLocation();
    switch(e.which) {
        case 37: // left
		case keyboardKeys.NUMPAD_4:
			if (isDirectionTraversable(new Location(-1,0), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["west"]);
				}
				else {
					travelRelative(-1, 0);
				}
			}
        break;
	
		// up and left
		case keyboardKeys.NUMPAD_7:
			if (isDirectionTraversable(new Location(-1,-1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["northwest"]);
				}
				else {
					travelRelative(-1, -1);
				}
			}
        break;

        case 38: // up
		case keyboardKeys.NUMPAD_8:
			if (isDirectionTraversable(new Location(0,-1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["north"]);
				}
				else {
					travelRelative(0, -1);
				}
			}
        break;
	
		// up and right
		case keyboardKeys.NUMPAD_9:
			if (isDirectionTraversable(new Location(1,-1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["northeast"]);
				}
				else {
					travelRelative(1, -1);
				}
			}
        break;

        case 39: // right
		case keyboardKeys.NUMPAD_6:
			if (isDirectionTraversable(new Location(1,0), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["east"]);
				}
				else {
					travelRelative(1, 0);
				}
			}
        break;
	
		// right and down
		case keyboardKeys.NUMPAD_3:
			if (isDirectionTraversable(new Location(1,1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["southeast"]);
				}
				else {
					travelRelative(1, 1);
				}
			}
        break;

        case 40: // down
		case keyboardKeys.NUMPAD_2:
			if (isDirectionTraversable(new Location(0,1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["south"]);
				}
				else {
					travelRelative(0, 1);
				}
			}
        break;
	
		// down and left
		case keyboardKeys.NUMPAD_1:
			if (isDirectionTraversable(new Location(-1,1), il)) {
				if (isPlayerInInternalLocation()) {
					doTravelToInternalLocation(il.directions["southwest"]);
				}
				else {
					travelRelative(-1, 1);
				}
			}
        break;
	
		// down and left
		case keyboardKeys.NUMPAD_5:
			if (isDirectionTraversable("out", il)) {
				if (isPlayerInInternalLocation()) {
					doExitInternalLocation();
				}
				else {
					doEnterInternalLocation(getTerrainAtCurrentLocation().internalLocation);
				}
			}
        break;
	
		case keyboardKeys.SHIFT_KEY:
			if (DEBUG && isGameRecording() && isPlayerInInternalLocation()) {
				drawTravelDirections();
			}
			break;

        default:
			//console.log(e.which);
			return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

//////////////////////////////////////////////////////////////////////////////
// INCREMENTAL LOOP
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second
	if (DEBUG) {
		$("#cntr").text(++sec);
	}
	
}, constants.TIME_INTERVAL);

