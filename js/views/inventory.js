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
	if (hasRoomInInventoryForItems(inventory, itemName, quantity) &&
		removeItemsFromInventory('player', itemName, quantity)) {
		//add to terrain's inventory
		addItemsToInventory(inventory, itemName, quantity);
		drawInventoryTable();
		drawCraftingTable();
		updateCategoryTreeUi();
	}
}

function pickupItem(inventory, itemName, quantity) {
	//add to player inventory
	if (hasItemsInInventory(resolveInventory(inventory), getGenericItemAsset(itemName), quantity) && 
			addItemsToInventory('player', itemName, quantity)) {
		removeItemsFromInventory(inventory, itemName, quantity);
		drawInventoryTable();
		drawCraftingTable();
		updateCategoryTreeUi();
	}	
}

//TODO: this is a long ugly function, buggy, definitely needs refactor
function drawInventoryTable() {
	if (playerActions.Inventory.availableToPlayer) {
		$("#playerInventory,#groundInventory").empty();
		$("#playerWeight").text(constants.INVENTORY_TABLE_INVENTORY_WEIGHT
						.replace("%INVENTORY_WEIGHT%", getCapacity(resolveInventory('player')))
						.replace("%PLAYER_CAPACITY%", resolveInventory('player').capacity) );
		
		var playerInventoryButtons = "";
		var groundInventoryButtons = "";
		var pickupResource = [];
		var dropResource = [];

		//items held by player
		for (var v in player.inventory.itemQuantityCollection) {
			var itemAndQuantity = player.inventory.itemQuantityCollection[v];
			if ((itemAndQuantity.quantity > 0) /*||
				(typeof getCurrentLocationInventory().itemQuantityCollection[itemAndQuantity.item.name] !== "undefined" && 
				getCurrentLocationInventory().itemQuantityCollection[itemAndQuantity.item.name].quantity > 0)*/) {
				
				//BE: IS THIS CONDITION NEEDED?  I DOUBT IT
				//if (itemAndQuantity.quantity > 0) {
					playerInventoryButtons += constants.PLAYER_INVENTORY_BUTTON
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					dropResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				//}
				/*
				//add the mirroring button, otherwise add blank row
				if (typeof getCurrentLocationInventory().itemQuantityCollection[itemAndQuantity.item.name] !== "undefined" && 
					getCurrentLocationInventory().itemQuantityCollection[itemAndQuantity.item.name].quantity > 0) {
	
					itemAndQuantity = getCurrentLocationInventory().itemQuantityCollection[itemAndQuantity.item.name];
					rows += constants.LOCATION_INVENTORY_BUTTON
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					pickupResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				}
				else {
					rows += constants.BLANK_LOCATION_INVENTORY_ROW;
				}
				*/
			}
		}

		//items on the ground that have never been picked up by player
		if (player.availableTerrain != null && getCurrentLocation() !== "undefined") {
			for (var v in getCurrentLocationInventory().itemQuantityCollection) {
				
				itemAndQuantity = getCurrentLocationInventory().itemQuantityCollection[v];
				
				//if (typeof player.inventory.itemQuantityCollection[itemAndQuantity.item.name] === "undefined") {
				if ((itemAndQuantity.quantity > 0)){
					groundInventoryButtons += constants.LOCATION_INVENTORY_BUTTON
						.replace("%ITEM_WEIGHT%", itemAndQuantity.item.weight)
						.replace("%ITEM_NAME%", itemAndQuantity.item.printableName)
						.replace("%ITEM_QUANTITY%", itemAndQuantity.quantity)
						.replace("%ITEM%", itemAndQuantity.item.name);
					pickupResource.push({currentLocation: player.currentLocation, item: itemAndQuantity.item.name});
				}
				//}
			}
		}

		$("#playerInventory").append(playerInventoryButtons);
		$("#groundInventory").append(groundInventoryButtons);
		jqueryifyButtons();

		for (var p in pickupResource) {
			// debugger;
			var item = pickupResource[p].item;
			if (isPlayerInInternalLocation()) {
				var loc = getCurrentInternalLocation();
				var f = new Function("handlePickupItemPress('" + item + "'," + loc.id + ")");
			} else {
				//player is in wilds
				var loc = pickupResource[p].currentLocation;
				var f = new Function("handlePickupItemPress('" + item + "',new Location(" + loc.x + "," + loc.y + "))");
			}
			$("#" + item + "Pickup").on("click", f );
		}

		for (var p in dropResource) {
			// debugger;
			var item = dropResource[p].item;
			if (isPlayerInInternalLocation()) {
				var loc = getCurrentInternalLocation();
				var f = new Function("handleDropItemPress('" + item + "'," + loc.id + ")");
			} else {
				//player is in wilds
				var loc = dropResource[p].currentLocation;
				var f = new Function("handleDropItemPress('" + item + "',new Location(" + loc.x + "," + loc.y + "))");
			}
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