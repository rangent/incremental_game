
//////////////////////////////////////////////////////////////////////////////
// GAME'S START
//////////////////////////////////////////////////////////////////////////////

function setupNewGame() {
	initializePlayerAsset();
    var ms = generateAndDrawLand(constants.MAP_WIDTH, constants.MAP_HEIGHT);
	initializeMap(ms.map);
	player.currentTerrain = new Location(ms.start[0], ms.start[1]);
	debugger;
}

function initializePlayerAsset() {
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

