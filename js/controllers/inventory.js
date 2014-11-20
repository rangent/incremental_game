/*
 *	Inventory controller
 */

function initializePlayerInventory() {
	player.inventory = new Inventory(100, {}, "Player");
}

/*
 *  @inventory : string representing inventory to modify
 *  @itemName : unique name of the item
 *	@quantity : integer
 */
function addItemsToInventory(inventory, itemName, quantity) {
	inventory = resolveInventory(inventory);
	var item = getGenericItemAsset(itemName);
	if ((item.weight * quantity) <= getRemainingCapacity(inventory)) {
		addItemsToInventoryModel(inventory, item, quantity);
		return true;
	}
	return false;
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
		currentWeight += inventory.itemQuantityCollection[i].item.weight * inventory.itemQuantityCollection[i].quantity;
	}
	return inventory.capacity - currentWeight;
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
	else if (typeof inventory === "object" && inventory.hasOwnProperty("x") &&
			 inventory.hasOwnProperty("y") && typeof getCurrentLocation() !== "undefined") {
		return getCurrentLocation().inventory;
	}
	console.log("Could not translate inventory: " + JSON.stringify(inventory));
	return null;
}