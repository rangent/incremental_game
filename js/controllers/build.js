/*
 * Build-specific controller, for build/craft general functions, use buildcraft.js
 */


function buildBuildingAtLocation(buildable, location) {
    var t = (player.inInternalEnvironment != null) ? player.settlements[player.inInternalEnvironment] : player.availableTerrain[location.y][location.x];
    t.buildings.push(buildable.building);
}