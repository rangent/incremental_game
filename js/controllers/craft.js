/*
 * Crafting controller
 */

/**
 * @param {GenericItem} genericItem : pass in a generic item to get an array of Craftables on how we can craft that item
 * @returns {Array} array of Craftables, returns empty array if item is uncraftable
 */
function getRecipesForItem(genericItem) {
    var ret = [];
    for (var i in itemLibrary.craftable) {
        if (itemLibrary.craftable[i].craftableItem.name == genericItem.name) {
            ret.push(itemLibrary.craftable[i]);
        }
    }
    return ret;
}

/**
 * This is the final method that actually moves items from inventory
 * @param {Craftable} craftableItem : item we want to craft
 * @param {[Inventory]} inventoryArray : array of items containing the materials to make the craftableItem
 */
function craftItemFromInventories(craftableItem, inventoryArray) {
    //TODO
}