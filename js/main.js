
//////////////////////////////////////////////////////////////////////////////
// GAME'S START
//////////////////////////////////////////////////////////////////////////////

function setupNewGame() {
	
	if (!masterState.global.mapGenerated) {
		initializePlayerTerrainAsset();
		var ms = generateMap(constants.MAP_WIDTH, constants.MAP_HEIGHT);
		player.currentTerrain = new Location(ms.start[0], ms.start[1]);
		initializeMap(ms.map);
		masterState.global.mapGenerated = true;
	}
	
	drawMaps(player.availableTerrain, player.currentTerrain);
	debugger;
}

function initializePlayerTerrainAsset() {
	player.availableTerrain = new Array(constants.MAP_HEIGHT);
	for (var y = 0; y < player.availableTerrain.length; y++) {
		player.availableTerrain[y] = new Array(constants.MAP_WIDTH);
	}
}

//////////////////////////////////////////////////////////////////////////////
// INCREMENTAL LOOP
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second
	if (DEBUG) {
		$("#cntr").text(++sec);
	}
	
}, constants.TIME_INTERVAL);

