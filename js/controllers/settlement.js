/*
 * Settlement controller
 */

/*
 * Establish a settled area at the specificed location
 * @param {Location} location : location to establish the new settlement
 */
function establishSettledArea(location) {
    var terrain = player.availableTerrain[location.y][location.x];
    var settlement = new Settlement(location, null);
    terrain.settlement = player.settlements.length;
    player.settlements.push(settlement);
}

//TODO: does this make sense?  What does it mean to be a "home"?
//We should have some charactarization other than this?
function setAsHome(terrain, homeName) { 
	terrain.isHome = true;
	terrain.text = homeName + " - " + terrain.text;
}