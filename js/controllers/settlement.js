/*
 * Internal Environment controller
 */

/**
 * Establish a settled area at the specificed location
 * @param {Location} location : location to establish the new internal location (settlement)
 */
function establishSettledArea(location) {
    var terrain = player.availableTerrain[location.y][location.x];
	var settlement = new InternalLocation({}, true, location);
	player.internalEnvironments[settlement.id ] = settlement;
    terrain.internalLocation = settlement.id;
    player.settlements.push(settlement);
}

/**
 * Have player enter the internal location (settlement), assumes check was done to make sure an internal location is actually there
 * @param {Integer} index : index of the settlement, or null if not
 */
function enterInternalLocation(index) { 
	player.currentInternalLocation = index;
    togglePlayerEnterOrExitInternalLocationActions();
}

/*
 * Some actions should be enabled or disabled based on whether or not player is in a proper venue
 */
function togglePlayerEnterOrExitInternalLocationActions() {
    //if player entering town
    if (playerInTown()) { //will eventually expand this if production buildings are in camps
        playerActions.Forage.availableToPlayer = false;
    }
    //if player exiting town
    else {
        playerActions.Forage.availableToPlayer = true;
    }
}

/*
 * Have player exit a settlement, assumes check was done to make sure player was in a settlement
 */
function exitInternalLocation() {
    player.currentInternalLocation = null;
    togglePlayerEnterOrExitInternalLocationActions();
}

function playerInTown() {
    return player.currentInternalLocation != null && player.internalEnvironments[player.currentInternalLocation].isSettlement;
}