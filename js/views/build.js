/*
 * Buildable-specific view, for general build/craft view items, place in buildcraft.js
 */
function doBuild() {
    drawBuildingTable();
}

function drawBuildingTable() {
    if (playerActions.Build.availableToPlayer) {
        $("#buildTable").empty().append(constants.BUILDABLE_TABLE_HEADER);
        var nothingBuildable = true;
        for (var b in buildable) {
            if (isPossibleToBuildAtCurrentLocation(buildable[b]) /* && 
                 isPossibleToMakeItemWithInventories(buildable[b], getInventoriesWithBuildableMaterialsForPlayer()) */) {
                
                nothingBuildable = false; //theres at least something to build
                
                var name = buildable[b].building.name;
                var printableName = buildable[b].building.printableName;
                var jquerySelectorId = "#" + name + "Build";
                var loc = player.currentLocation;
                $("#buildTable").append(
                    constants.BUILDABLE_ITEM_ROW.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
                
                var buildableIndex = parseInt(b);
                //TODO: fix this for internal locations:
                var locationString = (isPlayerInInternalLocation()) ?
                    "" + getCurrentInternalLocation().id + ")" :
                    "new Location(" + loc.x + "," + loc.y +"))";
                var f = new Function("buildItemClick(" + buildableIndex + "," + locationString);
                $(jquerySelectorId).on("click", f );
                
                if (!isPossibleToMakeItemWithInventories(buildable[b], getInventoriesWithBuildableMaterialsForPlayer())) {
                    $(jquerySelectorId).prop("disabled",true);
                    //TODO: NEED TO INCLUDE TIP ON THE COST OF BUILDABLES
                }
            }
        }
        $("#buildTable").show();
    }
    else {
        $("#buildTable").empty().hide();
    }
}

function buildItemClick(buildableIndex, location) {
    var result = makeItemFromInventories(itemLibrary.buildable[buildableIndex], getInventoriesWithBuildableMaterialsForPlayer(), location);
    if (result == constants.SUCCESS) {
        drawInventoryTable();
        drawCraftingTable();
        drawBuildingTable();
        updateCurrentTerrain();
    }
    else {
        log(result);
    }
}