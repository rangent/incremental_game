/*
 *	Inventory controller
 */

function initializePlayerInventory() {
	player.inventory = new Inventory(100, {}, constants.INVENTORY.WEIGHTED);
	player.globalInventory = new Inventory(Number.MAX_VALUE, {}, constants.INVENTORY.WEIGHTED);
}

/*
 *  @inventory : string representing inventory to modify
 *  @itemName : unique name of the item
 *	@quantity : integer
 */
function addItemsToInventory(inventory, itemName, quantity) {
	inventory = resolveInventory(inventory);
	var item = getGenericItemAsset(itemName);
	var itemWeightInInventory = quantity;
	if (inventory.inventoryType == constants.INVENTORY.WEIGHTED) {
		itemWeightInInventory = itemWeightInInventory * item.weight;
	}
	if ((itemWeightInInventory) <= getRemainingCapacity(inventory)) {
		addItemsToInventoryModel(inventory, item, quantity);
		return true;
	}
	return false;
}

/*
 * Return the correct inventory, whether player is inside or outside
 */
function getTerrainAtCurrentLocationInventory() {
	//if (player.currentInternalLocation != null) {
	//	return player.globalInventory;
	//}
	if (isPlayerInInternalLocation()) {
		return resolveInventory(getCurrentInternalLocation().id);
	}
	else {
		return getTerrainAtCurrentLocation().inventory;
	}
}

function getCapacity(inventory) {
	var currentWeight = 0;
	for (var i in inventory.itemQuantityCollection) {
		currentWeight += inventory.itemQuantityCollection[i].item.weight * inventory.itemQuantityCollection[i].quantity;
	}
	return currentWeight;
}

function getRemainingCapacity(inventory) {
	var currentWeight = 0;
	for (var i in inventory.itemQuantityCollection) {
		if (inventory.inventoryType == constants.INVENTORY.RULEOF99) {
			currentWeight += inventory.itemQuantityCollection[i].quantity;
		}
		else if (inventory.inventoryType == constants.INVENTORY.WEIGHTED) {
			currentWeight += inventory.itemQuantityCollection[i].item.weight * inventory.itemQuantityCollection[i].quantity;
		}
		else if (DEBUG) {
			throw "Inventory does not have recognized inventory type!";
		}
	}
	return inventory.capacity - currentWeight;
}

function hasRoomInInventoryForItems(inventory, itemName, quantity) {
	var inv = resolveInventory(inventory);
	var item = getGenericItemAsset(itemName);
	var remainingCapacity = getRemainingCapacity(inv);
	if (inv.inventoryType == constants.INVENTORY.RULEOF99) {
		return (remainingCapacity - quantity) >= 0;
	}
	else if (inv.inventoryType == constants.INVENTORY.WEIGHTED) {
		return (remainingCapacity - (quantity * item.weight)) >= 0;
	}
	throw "Unimplemented inventory type";
}

function hasItemsInInventory(inventory, item, quantity) {
	if (typeof inventory.itemQuantityCollection[item.name] !== "undefined") {
		return inventory.itemQuantityCollection[item.name].quantity >= quantity;
	}
	return false;
}

function getNumberOfItemsInInventory(inventory, item) {
	if (typeof inventory.itemQuantityCollection[item.name] !== "undefined") {
		return inventory.itemQuantityCollection[item.name].quantity;
	}
	return 0;
}

/*
 *  @inventory : string representing inventory to modify
 *  @itemName : unique name of the item
 *	@quantity : integer
 */
function removeItemsFromInventory(inventory, itemName, quantity) {
	inventory = resolveInventory(inventory);
	var item = getGenericItemAsset(itemName);
	if (hasItemsInInventory(inventory, item, quantity)) {
		removeItemsFromInventoryModel(inventory, item, quantity);
		return true;
	}
	return false;
}

function resolveInventory(inventory) {
	if (inventory == "player") {
		return player.inventory;
	}
	//assuming a numeric "inventory" is an index of an internalEnvironment
	else if ($.isNumeric(inventory)) {
		return player.internalEnvironments[inventory].inventory;
	}
	//else if (player.currentInternalLocation != null) {
	//	return player.globalInventory;
	//}
	//if it's a location
	else if (typeof inventory === "object" && inventory.hasOwnProperty("x") &&
			 inventory.hasOwnProperty("y") && typeof getTerrainAtCurrentLocation() !== "undefined") {
		return getTerrainAtCurrentLocation().inventory;
	}
	console.log("Could not translate inventory: " + JSON.stringify(inventory));
	return null;
}