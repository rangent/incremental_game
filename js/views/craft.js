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