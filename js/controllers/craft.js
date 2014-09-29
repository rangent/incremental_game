/*
 * Crafting-specific controller, for build/craft general functions, use buildcraft.js
 */

/**
 * Get all of the different possible ways to make an item (or [] if uncraftable)
 * @param {GenericItem} genericItem : pass in a generic item to get an array of Craftables on how we can craft that item
 * @returns {Array} array of Craftables, returns empty array if item is uncraftable
 */
function getCraftRecipesForItem(genericItem) {
    var ret = [];
    for (var i in itemLibrary.craftable) {
        if (itemLibrary.craftable[i].craftableItem.name == genericItem.name) {
            ret.push(itemLibrary.craftable[i]);
        }
    }
    return ret;
}