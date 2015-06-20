
//////////////////////////////////////////////////////////////////////////////
// GAME'S START
//////////////////////////////////////////////////////////////////////////////

function setupNewGame() {
	if (!masterState.global.mapGenerated) {
		initializePlayerTerrainAsset();
		var ms = generateMap(constants.MAP_WIDTH, constants.MAP_HEIGHT);
		player.currentLocation = ms.start;
		game.seed = ms.map.seed;
		initializeMap(ms.map);
		establishSettledArea(player.currentLocation);
		enterSettlement(0);
		discoverLandAroundLocation(player.currentLocation);
		masterState.global.mapGenerated = true;
		player.internalEnvironments = [];
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
    switch(e.which) {
        case 37: // left
			if (isTerrainTraversable(new Location(-1,0))) {
				travelRelative(-1, 0);
			}
        break;

        case 38: // up
			if (isTerrainTraversable(new Location(0,-1))) {
				travelRelative(0, -1);
			}
        break;

        case 39: // right
			if (isTerrainTraversable(new Location(1,0))) {
				travelRelative(1, 0);
			}
        break;

        case 40: // down
			if (isTerrainTraversable(new Location(0,1))) {
				travelRelative(0, 1);
			}
        break;

        default: return; // exit this handler for other keys
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

