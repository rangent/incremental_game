/*
 *	Inventory views
 */

function unhideInventoryTabs() {
	$( "#resourceTabs" ).show();
}

/*
 * player drops (quantity) number of item (itemName) from player inventory to location (inventory)
 */ 
function dropItem(inventory, itemName, quantity) {
	//remove from player inventory
	removeItemsFromInventory('player', itemName, quantity);
	//add to terrain's inventory
	addItemsToInventory(inventory, itemName, quantity);
	drawInventoryTable();
}

function pickupItem(inventory, itemName, quantity) {
	//remove from player inventory
	if (addItemsToInventory('player', itemName, quantity)) {
		removeItemsFromInventory(inventory, itemName, quantity);
		drawInventoryTable();
	}	
}

function drawInventoryTable() {
	$("#resourceTable").empty();
	$("#resourceTable").append(constants.INVENTORY_TABLE_INVENTORY_WEIGHT
					.replace("%INVENTORY_WEIGHT%", getCapacity(resolveInventory('player')))
					.replace("%PLAYER_CAPACITY%", resolveInventory('player').capacity) );
	var rows = "";

	//items held by player
	for (var v in player.inventory.itemQuantityCollection) {
		var itemAndQuantity = player.inventory.itemQuantityCollection[v];
		if (itemAndQuantity.quantity > 0) {
			rows += constants.PLAYER_INVENTORY_ROW
				.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
				.replace("%ITEM_NAME%", itemAndQuantity.item.name)
				.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
				.replace("%CURRENT_LOCATION%", player.currentTerrain)
				.replace("%ITEM%", itemAndQuantity.item.name);
		}
		else {
			rows += constants.BLANK_PLAYER_INVENTORY_ROW;
		}

		//add the mirroring button, otherwise add blank row
		if (typeof player.availableTerrain[player.currentTerrain].inventory.itemQuantityCollection[itemAndQuantity.item.name] !== "undefined" && 
			player.availableTerrain[player.currentTerrain].inventory.itemQuantityCollection[itemAndQuantity.item.name].quantity > 0) {

			itemAndQuantity = player.availableTerrain[player.currentTerrain].inventory.itemQuantityCollection[itemAndQuantity.item.name];
			rows += constants.LOCATION_INVENTORY_ROW
				.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
				.replace("%ITEM_NAME%", itemAndQuantity.item.name)
				.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
				.replace("%CURRENT_LOCATION%", player.currentTerrain)
				.replace("%ITEM%", itemAndQuantity.item.name);
		}
		else {
			rows += constants.BLANK_LOCATION_INVENTORY_ROW;
		}
	}

	//items on the ground that have never been picked up by player
	if (player.availableTerrain.length > 0 && player.availableTerrain[player.currentTerrain] !== "undefined") {
		for (var v in player.availableTerrain[player.currentTerrain].inventory.itemQuantityCollection) {
			
			itemAndQuantity = player.availableTerrain[player.currentTerrain].inventory.itemQuantityCollection[v];
			
			if (typeof player.inventory.itemQuantityCollection[itemAndQuantity.item.name] === "undefined") {
				
				rows += constants.BLANK_PLAYER_INVENTORY_ROW;
				rows += constants.LOCATION_INVENTORY_ROW
					.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
					.replace("%ITEM_NAME%", itemAndQuantity.item.name)
					.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
					.replace("%CURRENT_LOCATION%", player.currentTerrain)
					.replace("%ITEM%", itemAndQuantity.item.name);
			}
		}
	}

	$("#resourceTable").append(rows);
	jqueryifyButtons();
}