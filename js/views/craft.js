/*
 * Crafting views
 */


function craftItem(craftable) {
    //TODO: figure out exactly which inventories we're drawing from
    //TODO: rerender whatever crafting window we decide to build
    var result = craftItemFromInventories(craftable, ['player']);
    if (result == "success") {
        drawInventoryTable();
    }
    else {
        log(result);
    }    
}

/**
 * @returns {[String]} InventoryArray (strings) - 
 */
function getCraftableInventoriesForPlayer() {
    //TODO: Should return more than just player inventory when we get storage setup
    return ['player'];
}

function drawCraftableItems() {
    $("#craftTable").empty().append(constants.CRAFTABLE_TABLE_HEADER);
    for (var c in craftable) {
        if (isPossibleToCraftItemWithInventories(craftable[c], getCraftableInventoriesForPlayer())) {
            $("#craftTable").append(
                constants.CRAFTABLE_ITEM_ROW.replace("%ITEM%",craftable[c].craftableItem.name).replace("%ITEM_NAME%",craftable[c].craftableItem.printableName));
            $("#" + craftable[c].craftableItem.name + "Craft").button();
            
            if (!isPlayerCapableOfCarryingCraftedItem(craftable[c])) {
                disableButton(craftable[c].craftableItem.name + "Craft");
            }
        }
    }
}