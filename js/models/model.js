/*
 *	Concrete models and relational models for every entity
 */

//////////////////////////////////////////////////////////////////////////////
// CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

//RESOURCES
// @param {Category[]} categories : array of categoryName(s)
function Resource(uniqueName, printableName, weight, age, categories) {
	this.id = seeds.itemIdSeed++;
	this.type = "Resource";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;
	this.age = age;
	this.categories = categories;
}

function Food(uniqueName, printableName, weight, age, categories) {
	this.id = seeds.itemIdSeed++;
	this.type = "Food";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;   
    this.age = age;
	this.categories = categories;
}

function Consumable(uniqueName, printableName, weight, age, categories) {
	this.id = seeds.itemIdSeed++;
	this.type = "Consumable";
	this.name = uniqueName;
	this.printableName = printableName;
	this.weight = weight;   
    this.age = age;
	this.categories = categories;
}

function Building(uniqueName, printableName, size, age, categories) {
    this.id = seeds.buildingIdSeed++;
	this.type = "Building";
	this.name = uniqueName;
	this.printableName = printableName;
	this.size = size;
	this.age = age;
	this.categories = categories;
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
 * @param {Building} building
 * @param {Integer} numProduced : number of buildings built per build order
 * @param {Boolean} isBuiltInSettlement : can the buildable be made in a settlement
 * @param {Boolean} isBuiltInWilds : can the buildable be built in the wilds
 * itemIngredientsArray : array of rel_inventoryQuantity : items needed to craft the craftableItem
 */
function Buildable(building, numProduced, isBuiltInSettlement, isBuildInWilds, itemIngredientsAndQuantityArray) {
	this.id = seeds.buildableSeed++;
	this.type = "Buildable";
	this.building = building;
	this.isBuiltInSettlement = isBuiltInSettlement;
	this.isBuiltInWilds = isBuildInWilds;
	this.numProduced = numProduced;
	this.itemIngredientsAndQuantityArray = itemIngredientsAndQuantityArray;
}


/**
 * @param {Integer} capacity : inventory's capacity
 * @param {rel_inventoryQuantity} itemQuantityCollection
 * @param {constants.INVENTORY} inventoryType
 */
function Inventory(capacity, itemQuantityCollection, inventoryType) {
	this.id = seeds.inventoryModelIdSeed++;
	this.type = "Inventory";
	this.capacity = capacity; //weight-based inventory model
	this.itemQuantityCollection = itemQuantityCollection;
	this.inventoryType = inventoryType;
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
 * @ijsloc : loc : location generated from island.js
 * @location : Location : Terrain's location
 */
function Terrain(terrainType, terrainFeatures, terrainModifiers, ijsloc, location) {
	this.id = seeds.terrainIdSeed++;
	this.type = "Terrain";
	this.capacity = 30;
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
	this.internalLocation = null;
	this.terrainType = terrainType;
	this.terrainFeatures = terrainFeatures;
	this.terrainModifiers = terrainModifiers;
	this.buildings = [];
	this.inventory = new Inventory(Number.MAX_VALUE, {}, constants.INVENTORY.WEIGHTED);
	this.explored = false; //all new locations are unexplored
	this.location = location;
	
	//from island.js' loc:
	this.elevation = ijsloc.elevation;
	this.moisture = ijsloc.moisture;
	this.ocean = ijsloc.ocean;
	this.river = ijsloc.river;
	this.riverSize = ijsloc.riverSize;
	this.source = ijsloc.source;
	this.biome = ijsloc.biome;
	this.water = ijsloc.water;
}

/**
 * Call this to get a single InternalLocation item.  This is meant to be part of the player.internalLocation array
 * @param {object} directions : The possible directions you can leave from this InternalLocation
 * 		eg: {"n" : 16, "w" : 44 , "s" : 0}
 * @param {boolean} isSettlement : is the IL a settlement?
 */
function InternalLocation(directions, isSettlement, location) {
	this.id = seeds.internalLocationIdSeed++;
	this.type = "InternalLocation";
	this.location = location; //for backwards compatibility with Settlement
	this.directions = directions;
	this.isSettlement = isSettlement;
	this.buildings = [];
	this.inventory = new Inventory(Number.MAX_VALUE, {}, constants.INVENTORY.WEIGHTED);
	this.size = 0; //BE TODO: refactor to remove this eventually... it's needed for building for now :(
	this.explored = false; //all new locations are unexplored
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
function Settlement(location, size) {
	this.id = seeds.settlementIdSeed++;
	this.location = location;
	this.size = (size == null) ? 0 : size;
	this.name = null;
	this.buildings = [];
}
*/

function getSettlementSizeName(settlement) {
	switch (settlement.size) {
		case 0 : return "Camp";
		case 1 : return "Large Camp";
		case 2 : return "Commune";
		case 3 : return "Village";
		case 4 : return "Town";
		case 5 : return "City";
		//I could keep going...
	}
	return null;
}

/**
 * @param x : Integer
 * @param y : Integer
 */
function Location(x,y) {
	this.x = x;
	this.y = y;
}

function isSameLocation(l1, l2) {
	if (typeof l1 === "Location" && typeof l2 === "Location" ) {
		return l1.x == l2.x && l1.y == l2.y;
	}
	return false;
}

/**
 * Point
 * @param {Integer} x : integer between 0 and constants.MAP_WIDTH
 * @param {Integer} y : integer between 0 and constants.MAP_HEIGHT
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.north = function() {
    return new Point(this.x, this.y-1);
}
Point.prototype.south = function() {
    return new Point(this.x, this.y+1);
}
Point.prototype.east = function() {
    return new Point(this.x+1, this.y);
}
Point.prototype.west = function() {
    return new Point(this.x-1, this.y);
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

/**
 * Single category node definition.  Category tree is defined in assets and built at runtime.
 * @param {Category[]} parents : categor(y/ies) above this category if subcategory.  Empty array if top-level
 * @param {String} name : category name (should be unique!)
 * @param {Object[]} children : 
 */
function Category (parents, name) {
	this.parents = parents;
	this.name = name;
	this.type = "Category";
	//children: array of categories or items that are this category's children.  This is defined at run time however, so should be initialized with 
	this.children = {};
	this.count = 0; //number of items associated with this category
}

//////////////////////////////////////////////////////////////////////////////
// END OF CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// RELATIONSHIPS
//////////////////////////////////////////////////////////////////////////////

/**
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