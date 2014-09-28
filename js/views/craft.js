/*
 * Crafting views
 */

/**
 * @param {Integer} index of the craftable item to create
 */
function craftItemClick(craftIndex) {
    craftItem(craftable[craftIndex]);
}

function craftItem(craftable) {
    //TODO: figure out exactly which inventories we're drawing from
    //TODO: rerender whatever crafting window we decide to build
    var result = craftItemFromInventories(craftable, ['player']);
    if (result == "success") {
        drawInventoryTable();
        drawCraftableItems();
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
            var name = craftable[c].craftableItem.name;
            var printableName = craftable[c].craftableItem.printableName;
            var jquerySelectorId = "#" + name + "Craft";
            $("#craftTable").append(
                constants.CRAFTABLE_ITEM_ROW.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
            $(jquerySelectorId).button();
            
            var index = parseInt(c);
			var f = new Function("craftItemClick(" + index + ")");
			$(jquerySelectorId).on("click", f );
            
            if (!isPlayerCapableOfCarryingCraftedItem(craftable[c])) {
                disableButton(name + "Craft");
            }
        }
    }
}