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
	if ((genericItem.weight * quantity) <= getRemainingCapacity(inventory)) {
		addItemsToInventory(inventory,genericItem, quantity);
		return true;
	}
	return false;
}