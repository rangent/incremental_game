/*
 *	Inventory controller
 */

function initializePlayerInventory() {
	player.inventory = new Inventory(100, {});
}

/*
 *  @inventory : Inventory
 *  @genericItem : GenericItem
 *	@quantity : integer
 */
function addItemsToInventory(inventory, genericItem, quantity) {
	if ((genericItem.getWeight() * quantity) <= inventory.getRemainingCapacity()) {
		inventory.addItemsToInventory(genericItem, quantity);
		return true;
	}
	return false;
}

/*
 *  @inventory : Inventory
 *  @genericItem : GenericItem
 *	@quantity : integer
 */
function removeItemsFromInventory(inventory, genericItem, quantity) {
	inventory.removeItemsFromInventory(genericItem, quantity);
}