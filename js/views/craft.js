/*
 * Crafting-specific views
 */


function doCraft() {
    drawCraftingTable();
}

/**
 * @param {Integer} index of the craftable item to create
 */
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
        drawBuildingTable();
    }
    else {
        log(result);
    }    
}

function drawCraftingTable() {
    $("#craftDiv").empty();
    if (playerActions.Craft.availableToPlayer) {
        for (var c in craftable) {
            if (isPossibleToMakeItemWithInventories(craftable[c], getInventoriesWithCraftableMaterialsForPlayer())) {
                var name = craftable[c].craftableItem.name;
                var printableName = craftable[c].craftableItem.printableName;
                var jquerySelectorId = "#" + name + "Craft";
                $("#craftDiv").append(
                    constants.CRAFTABLE_ITEM_BUTTON.replace("%ITEM%",name).replace("%ITEM_NAME%",printableName));
                
                var index = parseInt(c);
                var f = new Function("craftItemClick(" + index + ")");
                $(jquerySelectorId).on("click", f );
                
                if (!isInventoryCapableOfCarryingMadeItem(craftable[c], 'player') || !playerActions.Craft.actionEnabled) {
                    //TODO: I DONT THINK THIS WORKS:
                    disableButton(name + "Craft");
                }
            }
        }
        //resizePageElements(); needed?
    }
}