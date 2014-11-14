/*
 * Build-specific controller, for build/craft general functions, use buildcraft.js
 */

/**
 * Get all of the different possible buildings (or [] if uncraftable)
 * @param {Building} building : pass in a Building to get an array of Buildables for how we can build that building
 * @returns {Array} array of Buildables, returns empty array if item is unbuildable
 */
/*
function getBuildRecipesForItem(building) {
    var ret = [];
    for (var i in itemLibrary.buildable) {
        if (itemLibrary.buildable[i].building.name == building.name) {
            ret.push(itemLibrary.buildable[i]);
        }
    }
    return ret;
}
*/


function buildBuildingAtLocation(buildable, location) {
    var t = player.availableTerrain[location.y][location.x];
    t.buildings.push(buildable.building);
}