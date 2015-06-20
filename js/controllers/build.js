/*
 * Build-specific controller, for build/craft general functions, use buildcraft.js
 */


function buildBuildingAtLocation(buildable, location) {
    var t = (player.currentInternalLocation != null) ? player.internalEnvironments[player.currentInternalLocation] : player.availableTerrain[location.y][location.x];
    t.buildings.push(buildable.building);
}