/*
 * Buildable-specific view, for general build/craft view items, place in buildcraft.js
 */


function drawBuildingTable() {
    if (playerActions.Build.availableToPlayer) {
        $("#buildTable").empty().append(constants.BUILDABLE_TABLE_HEADER);
        for (var b in buildable) {
            if (isPossibleToMakeItemWithInventories(buildable[b], getInventoriesWithMakeableMaterialsForPlayer())) {
                var name = buildable[b].building.name;
                var printableName = buildable[b].building.printableName;
                var jquerySelectorId = "#" + name + "Build";
                $("#buildTable").append(
                    constants.BUILDABLE_ITEM_ROW.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
                $(jquerySelectorId).button();
                
                var index = parseInt(b);
                var f = new Function("buildItemClick(" + index + ")");
                $(jquerySelectorId).on("click", f );
                
                if (!isInventoryCapableOfCarryingMadeItem(buildable[b], 'player') || !playerActions.Build.actionEnabled) {
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