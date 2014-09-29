/*
 * Crafting-specific views
 */

/**
 * @param {Integer} index of the craftable item to create
 */
function doCraft() {
    drawCraftingTable();
}

function craftItemClick(craftIndex) {
    craftItem(craftable[craftIndex]);
}

function craftItem(craftable) {
    //TODO: figure out exactly which inventories we're drawing from
    //TODO: rerender whatever crafting window we decide to build
    var result = makeItemFromInventories(craftable, ['player'], 'player');
    if (result == "success") {
        drawInventoryTable();
        drawCraftingTable();
    }
    else {
        log(result);
    }    
}

function drawCraftingTable() {
    if (playerActions.Craft.availableToPlayer) {
        $("#craftTable").empty().append(constants.CRAFTABLE_TABLE_HEADER);
        for (var c in craftable) {
            if (isPossibleToMakeItemWithInventories(craftable[c], getInventoriesWithMakeableMaterialsForPlayer())) {
                var name = craftable[c].craftableItem.name;
                var printableName = craftable[c].craftableItem.printableName;
                var jquerySelectorId = "#" + name + "Craft";
                $("#craftTable").append(
                    constants.CRAFTABLE_ITEM_ROW.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
                $(jquerySelectorId).button();
                
                var index = parseInt(c);
                var f = new Function("craftItemClick(" + index + ")");
                $(jquerySelectorId).on("click", f );
                
                if (!isInventoryCapableOfCarryingMadeItem(craftable[c], 'player') || !playerActions.Craft.actionEnabled) {
                    disableButton(name + "Craft");
                }
            }
        }
        $("#craftTable").show();
    }
    else {
        $("#craftTable").hide();
    }
}