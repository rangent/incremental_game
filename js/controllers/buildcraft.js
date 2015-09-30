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

function isLocationCapableOfHoldingBuildable(makeable, inventory) {
    var building = getMakeableItem(makeable);
    if (inventory.hasOwnProperty("x") && inventory.hasOwnProperty("y")) {
        return true; //currently not bounding number of buildings capable of being built outside
    } else {
        var currentBuildingSizes = 0;
        var currentInternalLocation = player.internalEnvironments[inventory];
        for (var i in currentInternalLocation.buildings) {
            currentBuildingSizes += currentInternalLocation.buildings[i].size;
        }
        return (currentInternalLocation.size - currentBuildingSizes) >= building.size;
    }
}

/**
 * @param {Makeable} makeable : item to be made
 * @param {String} inventory : string representative of the inventory (resolvable to inventory)
 */
function isInventoryCapableOfCarryingMadeItem(makeable, inventory) {
    var itemToBeMade = getMakeableItem(makeable);
    var inventoryRemainingCapacity = getRemainingCapacity(resolveInventory(inventory));
    var ingredients = makeable.itemIngredientsAndQuantityArray;
    var ingredientWeight = 0;
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var numIngredientsNeeded = ingredients[i].count;
        var numIngredientsInPlayerInventory = getNumberOfItemsInInventory(resolveInventory(inventory), item);
        //formula: a) we have more of the needed ingredient in the player's inventory, so use 'numIngredientsNeeded'   OR:
        //         b) we have some of the needed ingredients in the player's inventory, so use 'numIngredientsInPlayerInventory' insteaad
        ingredientWeight = Math.min(numIngredientsNeeded, numIngredientsInPlayerInventory) * item.weight;
    }
    
    var size = itemToBeMade.weight;
    
    return ( (inventoryRemainingCapacity) >= (size * makeable.numProduced  - ingredientWeight) );
}



/**
 * Make a makeable from inventories
 * @param {Makeable} craftableItem : item we want to craft
 * @param {[String]} inventoryArray : array of resolvable inventories containing the materials to make the craftableItem
 * @param {String} targetInventoryForMadeItem : string representation of inventory (resolvable to concrete inventory)
 * @returns {String} constants.SUCCESS string if successful craft, Error message if otherwise
 */
function makeItemFromInventories(makeable, inventoryArray, targetInventoryForMadeItem) {    
    //check for errors first
    var makeableItem = getMakeableItem(makeable);
    if (!isPossibleToMakeItemWithInventories(makeable, inventoryArray)) {
        return "Insufficient items to craft " + makeableItem.printableName;
    }
    
    if (isType(makeable,"Buildable") && !isLocationCapableOfHoldingBuildable(makeable, targetInventoryForMadeItem)) {
        return "Not enough room at location to build " + makeableItem.printableName;
    } else if (!isType(makeable,"Buildable") && !isInventoryCapableOfCarryingMadeItem(makeable, targetInventoryForMadeItem)) {
        return "Not enough room in player's inventory to hold " + makeableItem.printableName;
    }
    
    //proceed with crafting:
    //for each ingredient/quantity, remove the number of items from the inventories first
    removeItemsFromInventories(makeable.itemIngredientsAndQuantityArray, inventoryArray);
    
    //finally "craft" the item (add it to player's inventory)
    if (isType(makeable,"Buildable")) {
        buildBuildingAtLocation(makeable, targetInventoryForMadeItem);
    }
    else {
        addItemsToInventoryModel(resolveInventory(targetInventoryForMadeItem), makeableItem, makeable.numProduced);
    }
    
    return constants.SUCCESS; //string to indicate successful
}

/**
 * @param {[rel_inventoryQuantity]} ingredients : array of item/quantities, assumed inventoryArrays have the desired amount of materials (use with isPossibleToMakeItemWithInventories())
 * @param {[String]} inventoryArray : array of resolvable inventories containing the materials to make the craftableItem
 */
function removeItemsFromInventories(ingredients, inventoryArray) {
    for (var i in ingredients) {
        var item = ingredients[i].item;
        var numIngredientsNeeded = ingredients[i].count;
        for (var j in inventoryArray) {
            var numHave = getNumberOfItemsInInventory(resolveInventory(inventoryArray[j]), item);
            removeItemsFromInventoryModel(resolveInventory(inventoryArray[j]),item,Math.min(numIngredientsNeeded,numHave));
            numIngredientsNeeded = (numHave >= numIngredientsNeeded) ? 0 : numIngredientsNeeded - numHave;
        }
    }
}