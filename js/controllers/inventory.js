/*
 *	Inventory controller
 */

function initializePlayerInventory() {
	player.inventory = new Inventory(100, {}, constants.INVENTORY.WEIGHTED);
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
function getCurrentLocationInventory() {
	if (player.inSettlement != null) {
		return player.settlements[player.inSettlement].inventory;
	}
	else {
		return getCurrentLocation().inventory;
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
	else if (player.inSettlement != null) {
		return player.settlements[player.inSettlement].inventory;
	}
	//if it's a location
	else if (typeof inventory === "object" && inventory.hasOwnProperty("x") &&
			 inventory.hasOwnProperty("y") && typeof getCurrentLocation() !== "undefined") {
		return getCurrentLocation().inventory;
	}
	console.log("Could not translate inventory: " + JSON.stringify(inventory));
	return null;
}