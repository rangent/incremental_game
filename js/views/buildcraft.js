/*
 * Generic build + craft view stuff
 */


/**
 * @returns {[String]} InventoryArray (strings) - 
 */
function getInventoriesWithCraftableMaterialsForPlayer() {
    return ['player'];
}

/**
 * @returns {[String]} InventoryArray (strings) - 
 */
function getInventoriesWithBuildableMaterialsForPlayer() {
    return ['player', player.currentTerrain];
}