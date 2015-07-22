/*
 *	Generic terrain actions
 */

/*
 * do <action> on terrain, return item(s) if any found
 * @action : string : name of action
 * @terrainId : integer : id of location associated with player.availableTerrain
 */

function resolveActionOnTerrain(action, terrainId) {
	//this is going to be complicated... :(

	var t = getTerrainAtCurrentLocation();
	var findProbability = 0;
	var itemsAndProbabilitiesArray = [];

	//first collect items from the terrain type
	if (typeof t.terrainType.terrainActions[action] !== "undefined") {
		var tt = t.terrainType.terrainActions[action];
		findProbability = tt.findProbability;
		
		for (var i in tt.items) {
			itemsAndProbabilitiesArray.push(new rel_itemAndQuantityProbability(i, tt.items[i].quantity, tt.items[i].probability));
		}
	}

	//merge any items from the terrain features
	for (var f in t.terrainFeatures) {
		if (typeof t.terrainFeature !== "undefined" && typeof t.terrainFeature[f].terrainActions[action] !== "undefined") {
			var tf = t.terrainFeature[f].terrainActions[action];
			findProbability += tf.findProbability;
			for (var i in tf.items) {
				itemsAndProbabilitiesArray.push(new rel_itemAndQuantityProbability(i, tf.items[i].quantity, tf.items[i].probability));
			}
		}
	}

	//adjust based on terrain modifiers
	//TODO...

	//normalize the values compared to one another
	var total = 0;
	for (var l in itemsAndProbabilitiesArray) {
		total += itemsAndProbabilitiesArray[l].probability;
	}
	for (var l in itemsAndProbabilitiesArray) {
		itemsAndProbabilitiesArray[l].probability = itemsAndProbabilitiesArray[l].probability / total;
	}

	//finally, calculate if any items have been found
	if ((Math.random() - findProbability) <= 0) {
		var p = Math.random();
		for (var l in itemsAndProbabilitiesArray) {
			p -= itemsAndProbabilitiesArray[l].probability;
			if (p <= 0) {
				return new rel_inventoryQuantity(itemsAndProbabilitiesArray[l].item, itemsAndProbabilitiesArray[l].quantity);
			}
		}
	}

	return null;
}