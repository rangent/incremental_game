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

function Building(uniqueName, printableName, size, age) {
    this.id = seeds.buildingIdSeed++;
	this.type = "Building";
	this.name = uniqueName;
	this.printableName = printableName;
	this.size = size;
	this.age = age;
}

/**
 * craftableItem : generic item
 * numProduced : number of items produced per crafting
 * itemIngredientsArray : array of rel_inventoryQuantity : items needed to craft the craftableItem
 */
function Craftable(craftableItem, numProduced, itemIngredientsAndQuantityArray) {
	this.id = seeds.craftableSeed++;
	this.type = "Craftable";
	this.craftableItem = craftableItem;
	this.numProduced = numProduced;
	this.itemIngredientsAndQuantityArray = itemIngredientsAndQuantityArray;
}

function getMakeableItem(item) {
	if (item.type == "Craftable") {
		return item.craftableItem;
	}
	else if (item.type == "Buildable") {
		return item.building;
	}
	return null;
}

/**
 * building : building
 * numProduced : number of buildings built per build order
 * itemIngredientsArray : array of rel_inventoryQuantity : items needed to craft the craftableItem
 */
function Buildable(building, numProduced, itemIngredientsAndQuantityArray) {
	this.id = seeds.buildableSeed++;
	this.type = "Buildable";
	this.building = building;
	this.numProduced = numProduced;
	this.itemIngredientsAndQuantityArray = itemIngredientsAndQuantityArray;
}


// inventory
function Inventory(capacity, itemQuantityCollection) {
	this.id = seeds.inventoryModelIdSeed++;
	this.type = "Inventory";
	this.capacity = capacity; //weight-based inventory model
	this.itemQuantityCollection = itemQuantityCollection;
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
 * @loc : loc : location generated from island.js
 */
function Terrain(terrainType, terrainFeatures, terrainModifiers, loc) {
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
	this.explored = false; //all new locations are unexplored
	
	//from island.js' loc:
	this.elevation = loc.elevation;
	this.moisture = loc.moisture;
	this.nextRiver = loc.nextRiver;
	this.ocean = loc.ocean;
	this.river = loc.river;
	this.riverSize = loc.riverSize;
	this.source = loc.source;
	//this.voronoiId = loc.voronoiId; //dont think I'll need this
	this.water = loc.water;
}
//TODO: does this make sense?  What does it mean to be a "home"?
//We should have some charactarization other than this?
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
 * @param x : Integer
 * @param y : Integer
 */
function Location(x,y) {
	this.x = x;
	this.y = y;
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
 * Relationships between a terrain type and the probability of something being found there
 * (Used by terrain features and possibly others)
 *  @param {TerrainType} terrainType
 *  @param {Double} probability : number between 0 and 1, liklihood of occuring on that terrain type
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