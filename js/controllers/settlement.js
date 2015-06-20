/*
 * Settlement controller
 */

/**
 * Establish a settled area at the specificed location
 * @param {Location} location : location to establish the new settlement
 */
function establishSettledArea(location) {
    var terrain = player.availableTerrain[location.y][location.x];
    var settlement = new Settlement(location, null);
    terrain.settlement = player.settlements.length;
    player.settlements.push(settlement);
}

/**
 * Have player enter the settlement, assumes check was done to make sure a settlement is actually there
 * @param {Integer} index : index of the settlement, or null if not
 */
function enterSettlement(index) { 
	player.inInternalEnvironment = index;
    togglePlayerEnterOrExitSettlementActions();
}

/*
 * Some actions should be enabled or disabled based on whether or not player is in a proper venue
 */
function togglePlayerEnterOrExitSettlementActions() {
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
function exitSettlement() {
    player.inInternalEnvironment = null;
    togglePlayerEnterOrExitSettlementActions();
}

function playerInTown() {
    return player.inInternalEnvironment != null;
}