/*
 * Join all common methods used between building and crafting
 */

/**
 * @param {Makeable} makeable : craftable/buildable item we want to make
 * @param {[Inventory]} inventoryArray : array of items containing the materials to make the craftableItem
 * @returns {Boolean} true if possible, false otherwise
 */
function isPossibleToMakeItemWithInventories(makeable, inventoryArray) {
    var ingredients = makeable.itemIngredientsAndQuantityArray;
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

/**
 * @param {Makeable} makeable : item to be made
 * @param {String} inventory : string representative of the inventory (resolvable to inventory)
 */
function isInventoryCapableOfCarryingMadeItem(makeable, inventory) {
    var playerRemainingCapacity = getRemainingCapacity(resolveInventory(inventory));
    var ingredients = makeable.itemIngredientsAndQuantityArray;
    var ingredientWeight = 0;
    var itemToBeMade = getMakeableItem(makeable);
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var numIngredientsNeeded = ingredients[i].count;
        var numIngredientsInPlayerInventory = getNumberOfItemsInInventory(resolveInventory(inventory), item);
        //formula: a) we have more of the needed ingredient in the player's inventory, so use 'numIngredientsNeeded'   OR:
        //         b) we have some of the needed ingredients in the player's inventory, so use 'numIngredientsInPlayerInventory' insteaad
        ingredientWeight = Math.min(numIngredientsNeeded, numIngredientsInPlayerInventory) * item.weight;
    }
    return ( (playerRemainingCapacity) >= (itemToBeMade.weight * makeable.numProduced  - ingredientWeight) );
}



/**
 * Make a makeable from inventories
 * @param {Makeable} craftableItem : item we want to craft
 * @param {[String]} inventoryArray : array of items containing the materials to make the craftableItem
 * @param {String} targetInventoryForMadeItem : string representation of inventory (resolvable to concrete inventory)
 * @returns {String} "success" string if successful craft, Error message if otherwise
 */
function makeItemFromInventories(makeable, inventoryArray, targetInventoryForMadeItem) {    
    //check for errors first
    var makeableItem = getMakeableItem(makeable);
    if (!isPossibleToMakeItemWithInventories(makeable, inventoryArray)) {
        return "Insufficient items to craft " + makeableItem.printableName;
    }
    if (!isInventoryCapableOfCarryingMadeItem(makeable, targetInventoryForMadeItem)) {
        return "Not enough room in player's inventory to hold " + makeableItem.printableName;
    }
    
    //proceed with crafting:
    //for each ingredient/quantity, remove the number of items from the inventories first
    var ingredients = makeable.itemIngredientsAndQuantityArray;
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
    if (makeable.type == "Buildable") {
        buildBuildingAtLocation(makeable, targetInventoryForMadeItem);
    }
    else {
        addItemsToInventoryModel(resolveInventory(targetInventoryForMadeItem), makeableItem, makeable.numProduced);
    }
    
    return "success"; //string to indicate successful
}