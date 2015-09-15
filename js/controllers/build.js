/*
 * Build-specific controller, for build/craft general functions, use buildcraft.js
 */

function buildBuildingAtLocation(buildable, location) {
    var t = isPlayerInInternalLocation() ? getCurrentInternalLocation() : getTerrainAtCurrentLocation();
    t.buildings.push(buildable.building);
}

function isPossibleToBuildAtCurrentLocation(buildable) {
    if (isPlayerInInternalLocation() && buildable.isBuiltInSettlement) {
        return true;
    }
    else if (!isPlayerInInternalLocation() && buildable.isBuiltInWilds) {
        return true;
    }
    return false;
}