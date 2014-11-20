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

/*
 * Have player enter the settlement, assumes check was done to make sure a settlement is actually there
 * @param {Integer} index : index of the settlement, or null if not
 */
function enterSettlement(index) { 
	player.inSettlement = index;
}