/*
 * Build-specific controller, for build/craft general functions, use buildcraft.js
 */


function buildBuildingAtLocation(buildable, location) {
    var t = (player.inSettlement != null) ? player.settlements[player.inSettlement] : player.availableTerrain[location.y][location.x];
    t.buildings.push(buildable.building);
}