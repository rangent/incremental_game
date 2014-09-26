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
 * Craft items from inventory
 * @param {Craftable} craftableItem : item we want to craft
 * @param {[Inventory]} inventoryArray : array of items containing the materials to make the craftableItem
 * @returns {String} "success" string if successful craft, Error message if otherwise
 */
function craftItemFromInventories(craftable, inventoryArray) {    
    //check for errors first
    if (!isPossibleToCraftItemWithInventories(craftable, inventoryArray)) {
        return "Insufficient items to craft " + craftable.craftableItem.printableName;
    }
    if (!isPlayerCapableOfCarryingCraftedItem(craftable)) {
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

/**
 * @param {Craftable} craftable : craftable item we want to craft
 * @param {[Inventory]} inventoryArray : array of items containing the materials to make the craftableItem
 * @returns {Boolean} true if possible, false otherwise
 */
function isPossibleToCraftItemWithInventories(craftable, inventoryArray) {
    var ingredients = craftable.itemIngredientsAndQuantityArray;
    //for each ingredient/quantity, verify the number of items are in the inventories
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var count = ingredients[i].count;
        for (var j in inventoryArray) {
            count -= getNumberOfItemsInInventory(resolveInventory(inventoryArray[j]), item);
        }
        //once we've gone through the inventories, fail if there would still be items needed
        if (count > 0) {
            return false;
        }
    }
    //all else has gone well!  Item is craftable!
    return true;
}

function isPlayerCapableOfCarryingCraftedItem(craftable) {
    var playerRemainingCapacity = getRemainingCapacity(resolveInventory('player'));
    var ingredients = craftable.itemIngredientsAndQuantityArray;
    var ingredientWeight = 0;
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var numIngredientsNeeded = ingredients[i].count;
        var numIngredientsInPlayerInventory = getNumberOfItemsInInventory(resolveInventory('player'), item);
        //formula: a) we have more of the needed ingredient in the player's inventory, so use 'numIngredientsNeeded'   OR:
        //         b) we have some of the needed ingredients in the player's inventory, so use 'numIngredientsInPlayerInventory' insteaad
        ingredientWeight = Math.min(numIngredientsNeeded, numIngredientsInPlayerInventory) * item.weight;
    }
    return ( (playerRemainingCapacity - ingredientWeight) >= (craftable.craftableItem.weight * craftable.numProduced) );
}