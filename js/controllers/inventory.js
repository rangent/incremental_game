/*
 *	Inventory controller
 */

function initializePlayerInventory() {
	player.inventory = new Inventory(100, {});
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

/*
 *  @inventory : string representing inventory to modify
 *  @itemName : unique name of the item
 *	@quantity : integer
 */
function removeItemsFromInventory(inventory, itemName, quantity) {
	removeItemsFromInventoryModel(resolveInventory(inventory), getGenericItemAsset(itemName), quantity);
}

function resolveInventory(inventory) {
	if (inventory == "player") {
		return player.inventory;
	}
	else if (typeof inventory === "number" && typeof player.availableTerrain[inventory] !== "undefined") {
		return player.availableTerrain[inventory].inventory;
	}
	return null;
}