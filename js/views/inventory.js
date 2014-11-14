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
	if (removeItemsFromInventory('player', itemName, quantity)) {
		//add to terrain's inventory
		addItemsToInventory(inventory, itemName, quantity);
		drawInventoryTable();
		drawCraftingTable();
	}
}

function pickupItem(inventory, itemName, quantity) {
	//remove from player inventory
	if (hasItemsInInventory(resolveInventory(inventory), getGenericItemAsset(itemName), quantity) && 
			addItemsToInventory('player', itemName, quantity)) {

		removeItemsFromInventory(inventory, itemName, quantity);
		drawInventoryTable();
		drawCraftingTable();
	}	
}

function drawInventoryTable() {
	if (playerActions.Inventory.availableToPlayer) {
		$("#resourceTable").empty();
		$("#resourceTable").append(constants.INVENTORY_TABLE_INVENTORY_WEIGHT
						.replace("%INVENTORY_WEIGHT%", getCapacity(resolveInventory('player')))
						.replace("%PLAYER_CAPACITY%", resolveInventory('player').capacity) );
		var rows = "";
		var pickupResource = [];
		var dropResource = [];

		//items held by player
		for (var v in player.inventory.itemQuantityCollection) {
			var itemAndQuantity = player.inventory.itemQuantityCollection[v];
			if ((itemAndQuantity.quantity > 0) ||
				(typeof getCurrentLocation().inventory.itemQuantityCollection[itemAndQuantity.item.name] !== "undefined" && 
				getCurrentLocation().inventory.itemQuantityCollection[itemAndQuantity.item.name].quantity > 0)) {
				
				if (itemAndQuantity.quantity > 0) {
					rows += constants.PLAYER_INVENTORY_ROW
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					dropResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				}
				else {
					rows += constants.BLANK_PLAYER_INVENTORY_ROW;
				}
	
				//add the mirroring button, otherwise add blank row
				if (typeof getCurrentLocation().inventory.itemQuantityCollection[itemAndQuantity.item.name] !== "undefined" && 
					getCurrentLocation().inventory.itemQuantityCollection[itemAndQuantity.item.name].quantity > 0) {
	
					itemAndQuantity = getCurrentLocation().inventory.itemQuantityCollection[itemAndQuantity.item.name];
					rows += constants.LOCATION_INVENTORY_ROW
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					pickupResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				}
				else {
					rows += constants.BLANK_LOCATION_INVENTORY_ROW;
				}
			}
		}

		//items on the ground that have never been picked up by player
		if (player.availableTerrain != null && getCurrentLocation() !== "undefined") {
			for (var v in getCurrentLocation().inventory.itemQuantityCollection) {
				
				itemAndQuantity = getCurrentLocation().inventory.itemQuantityCollection[v];
				
				if (typeof player.inventory.itemQuantityCollection[itemAndQuantity.item.name] === "undefined") {
					
					rows += constants.BLANK_PLAYER_INVENTORY_ROW;
					rows += constants.LOCATION_INVENTORY_ROW
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					pickupResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				}
			}
		}

		$("#resourceTable").append(rows);
		jqueryifyButtons();

		for (var p in pickupResource) {
			// debugger;
			var item = pickupResource[p].item;
			var loc = pickupResource[p].currentLocation;
			var f = new Function("handlePickupItemPress('" + item + "',new Location(" + loc.x + "," + loc.y + "))");
			$("#" + item + "Pickup").on("click", f );
		}

		for (var p in dropResource) {
			// debugger;
			var item = dropResource[p].item;
			var loc = dropResource[p].currentLocation;
			var f = new Function("handleDropItemPress('" + item + "',new Location(" + loc.x + "," + loc.y + "))");
			$("#" + item + "Drop").on("click", f );	
		}

	}
}

function handleDropItemPress(item, loc) {
	closeJoyrideTips();
	var repetitions = 1;
	if (keys.shiftPressed) {
		repetitions = 10;
	}
	for (var r = 0; r < repetitions; r++) {
		dropItem(loc, item, 1);
	}
}

function handlePickupItemPress(item, loc) {
	closeJoyrideTips();
	var repetitions = 1;
	if (keys.shiftPressed) {
		repetitions = 10;
	}
	for (var r = 0; r < repetitions; r++) {
		pickupItem(loc, item, 1);
	}
}