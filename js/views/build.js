/*
 * Buildable-specific view, for general build/craft view items, place in buildcraft.js
 */


function drawBuildingTable() {
    if (playerActions.Build.availableToPlayer) {
        $("#buildTable").empty().append(constants.BUILDABLE_TABLE_HEADER);
        for (var b in buildable) {
            if (isPossibleToBuildAtCurrentLocation(buildable[b]) && 
                isPossibleToMakeItemWithInventories(buildable[b], getInventoriesWithBuildableMaterialsForPlayer())) {
                
                var name = buildable[b].building.name;
                var printableName = buildable[b].building.printableName;
                var jquerySelectorId = "#" + name + "Build";
                var loc = player.currentLocation;
                $("#buildTable").append(
                    constants.BUILDABLE_ITEM_ROW.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
                $(jquerySelectorId).button();
                
                var buildableIndex = parseInt(b);
                var f = new Function("buildItemClick(" + buildableIndex + ",new Location(" + loc.x + "," + loc.y +"))");
                $(jquerySelectorId).on("click", f );
                
                //TODO: BE: THE internalEnvironment.size IS NOT THE ALLOWABLE SIZE!  ITS THE SIZE OF THE PLACE (CAMP, VILLAGE, ETC)
                if ((isPlayerInInternalLocation()
                    && buildable[b].building.size * buildable[b].numProduced <= player.internalEnvironments[player.currentInternalLocation].size)
                    || !playerActions.Build.actionEnabled) {
                        disableButton(name + "Build");
                }
            }
        }
        $("#buildTable").show();
    }
    else {
        $("#buildTable").hide();
    }
}

function isPossibleToBuildAtCurrentLocation(buildable) {
    if (isPlayerInInternalLocation() && buildable.isBuiltInSettlement) {
        return true;
    }
    else if (player.currentInternalLocation == null && buildable.isBuiltInWilds) {
        return true;
    }
    return false;
}

function buildItemClick(buildableIndex, location) {
    var result = makeItemFromInventories(itemLibrary.buildable[buildableIndex], ['player', player.currentLocation], player.currentLocation);
    if (result == "success") {
        drawInventoryTable();
        drawCraftingTable();
        drawBuildingTable();
        updateCurrentTerrain();
    }
    else {
        log(result);
    }
}