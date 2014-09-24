/*
 *	Concrete models and relational models for every entity
 */

//////////////////////////////////////////////////////////////////////////////
// CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

//RESOURCES
function Resource(uniqueName, printableName, weight, age) {
	this.id = seeds.itemIdSeed++;
	this.type = "Resource";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;
	this.age = age;
}

function Food(uniqueName, printableName, weight, age) {
	this.id = seeds.itemIdSeed++;
	this.type = "Food";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;   
    this.age = age;
}

function Consumable(uniqueName, printableName, weight, age) {
	this.id = seeds.itemIdSeed++;
	this.type = "Consumable";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;   
    this.age = age;
}

/**
 * craftableItem : generic item
 * itemIngredientsArray : array of rel_inventoryQuantity : items needed to craft the craftableItem
 */
function Craftable(craftableItem, itemIngredientsAndQuantityArray) {
	this.id = seeds.craftableSeed++;
	this.craftableItem = craftableItem;
	this.itemIngredientsAndQuantityArray = itemIngredientsAndQuantityArray;
}

// inventory
function Inventory(capacity, itemQuantityCollection) {
	this.id = seeds.inventoryModelIdSeed++;
	this.type = "Inventory";
	this.capacity = capacity; //weight-based inventory model
	this.itemQuantityCollection = itemQuantityCollection;
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
//Should not call this unless a check to see if this breaches the capacity has been done
function addItemsToInventoryModel(inventory, genericItem, quantity) { 
	if (typeof inventory.itemQuantityCollection[genericItem.name] == "undefined") {
		inventory.itemQuantityCollection[genericItem.name] = {item: genericItem, quantity: quantity};
	}
	else {
		inventory.itemQuantityCollection[genericItem.name].quantity += quantity;
	}
}
function removeItemsFromInventoryModel(inventory, genericItem, quantity) { 
	if (typeof inventory.itemQuantityCollection[genericItem.name] == "undefined") {
		inventory.itemQuantityCollection[genericItem.name] = {item: genericItem, quantity: (0 - quantity)};
	}
	else {
		inventory.itemQuantityCollection[genericItem.name].quantity -= quantity;	
	}
}

/*
 * Call this to get a single concrete item of terrainType with terrainFeatures and terrainModifiers
 * @terrainType : single terrainType
 * @terrainFeature : terrainFeature array : possible features of this terrain element
 * @terrainModifier : terrainModifier array : possible modifiers to this terrain
 */
function Terrain(terrainType, terrainFeatures, terrainModifiers) {
	this.id = seeds.terrainIdSeed++;
	this.type = "Terrain";
	this.capacity = 30;
	this.isHome = false;
	var text = terrainType.ttname;
	if (terrainModifiers.length > 0) {
		for (var t in terrainModifiers) {
			text = terrainModifiers[t].tmname + " " + text;
		}
	}
	if (terrainFeatures.length > 0) {
		text = text +  " (";
		for (var t in terrainFeatures) {
			text = text + terrainFeatures[t].tfname + ", " ;
		}
		text = text.substring(0,text.length-2);
		text += ")";
	}
	this.text = text;
	this.terrainType = terrainType;
	this.terrainFeatures = terrainFeatures;
	this.terrainModifiers = terrainModifiers;
	this.inventory = new Inventory(Number.MAX_VALUE, {});
}
function setAsHome(terrain, homeName) { 
	terrain.isHome = true;
	terrain.text = homeName + " - " + terrain.text;
}

/*
 *	@ttname : string name
 *  @terrainActionsAndFindProbabilities : association between action -> FindProbabilities
 */
function TerrainType(ttname, terrainActionsAndFindProbabilities) {
	this.id = seeds.terrainTypeIdSeed++;
	this.type = "TerrainType";
	this.ttname = ttname;
	this.terrainActions = terrainActionsAndFindProbabilities;
}

/*
 *  @tfname : string name
 *  @description : help text description for feature
 *	@applicableTerrainTypes : terrainType array : where you'd find this feature
 *	@incompatibleTerrainFeatures : terrainFeature array : features this one wouldn't work with
 *  @terrainActionsAndFindProbabilities : association between action -> FindProbabilities, NOTE: this is merged/added to the TerrainType's terrainActionsAndFindProbabilities
 */
function TerrainFeature(tfname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainFeatures, terrainActionsAndFindProbabilities) {
	this.id = seeds.terrainFeatureIdSeed++;
	this.type = "TerrainFeature";
	this.tfname = tfname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainFeatures = incompatibleTerrainFeatures;
	this.terrainActions = terrainActionsAndFindProbabilities;
}

/*
 *  @tmname : string name
 *  @description : help text description for modifier
 *	@applicableTerrainTypeAndProbabilities : terrainType array : where you'd find this feature
 *	@incompatibleTerrainModifiers : terrainModifier array : modifiers this one wouldn't work with
 */
function TerrainModifier(tmname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainModifiers) {
	this.id = seeds.terrainModifierIdSeed++;
	this.type = "TerrainModifier";
	this.tmname = tmname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainModifiers = incompatibleTerrainModifiers;
}

/*
 * The probability an action succeeds, and the items that can be found if it succeeds
 * @probabilityActionSucceeds : number between 0 and 1 : liklihood <action> successful
 * @itemAndProbability : array of rel_itemAndQuantityProbability : item and relative probability it'll be found
 */
function FindProbabilities(probabilityActionSucceeds, itemAndProbabilityArray) {
	var l = {};
	for (var i in itemAndProbabilityArray) {
		l[itemAndProbabilityArray[i].item] = itemAndProbabilityArray[i];
	}
	this.items = l;
	this.findProbability = probabilityActionSucceeds;

}

//////////////////////////////////////////////////////////////////////////////
// END OF CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// RELATIONSHIPS
//////////////////////////////////////////////////////////////////////////////

/*
 * Relationships between a terrain and its probability of being found
 *  @terrainType : terrainType
 *  @probability : number between 0 and 1 : liklihood of occuring on that terrain type
 */
function rel_terrainTypeProbability(terrainType, probability) {
	this.terrainType = terrainType;
	this.probability = probability;
}

/*
 * Relationships between an item and its probability of being found
 *  @item : GenericItem (food, resource, consumable, etc)
 *  @quantity : integer : quantity of items to be found
 *  @probability : number : relative liklihood item will be found
 */
function rel_itemAndQuantityProbability(item, quantity, probability) {
	this.item = item;
	this.quantity = quantity;
	this.probability = probability;
}

/*
 * @item : GenericItem
 * @count : integer
 */
function rel_inventoryQuantity(item, count) {
	this.item = item;
	this.count = count;
}

//////////////////////////////////////////////////////////////////////////////
// END RELATIONSHIPS
//////////////////////////////////////////////////////////////////////////////