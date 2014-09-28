/*
 * Crafting-specific controller, for build/craft general functions, use buildcraft.js
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
 * Craft items from inventory
 * @param {Craftable} craftableItem : item we want to craft
 * @param {[String]} inventoryArray : array of items containing the materials to make the craftableItem
 * @returns {String} "success" string if successful craft, Error message if otherwise
 */
function craftItemFromInventories(craftable, inventoryArray) {    
    //check for errors first
    if (!isPossibleToMakeItemWithInventories(craftable, inventoryArray)) {
        return "Insufficient items to craft " + craftable.craftableItem.printableName;
    }
    if (!isInventoryCapableOfCarryingMadeItem(craftable, 'player')) {
        return "Not enough room in player's inventory to hold " + craftable.craftableItem.printableName;
    }
    
    //proceed with crafting:
    //for each ingredient/quantity, remove the number of items from the inventories first
    var ingredients = craftable.itemIngredientsAndQuantityArray;
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var numIngredientsNeeded = ingredients[i].count;
        for (var j in inventoryArray) {
            var numHave = getNumberOfItemsInInventory(resolveInventory(inventoryArray[j]), item);
            removeItemsFromInventoryModel(resolveInventory(inventoryArray[j]),item,Math.min(numIngredientsNeeded,numHave));
            numIngredientsNeeded = (numHave >= numIngredientsNeeded) ? 0 : numIngredientsNeeded - numHave;
        }
    }
    
    //finally "craft" the item (add it to player's inventory)
    addItemsToInventoryModel(resolveInventory('player'), craftable.craftableItem, craftable.numProduced);
    
    return "success"; //string to indicate successful
}