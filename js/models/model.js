/*
 *	Concrete models and relational models for every entity
 */

//////////////////////////////////////////////////////////////////////////////
// CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

function PlayerAction(aname, available, age) {
	this.id = seeds.actionIdSeed++;
	this.aname = aname;
	this.available = available;
	this.age = age;
}

//ITEM CONSTRUCTOR
function GenericItem(name, weight) {
	this.id = seeds.itemIdSeed++;
	this.name = name;
	this.weight = weight;
}
GenericItem.prototype.getName = function() { return this.name; };
GenericItem.prototype.getWeight = function() { return this.weight; };

//RESOURCES
function Resource(rname, weight, age) {
	GenericItem.call(this, rname, weight);
	this.age = age;
}
Resource.prototype.getAge = function() { return this.age; };
Resource.prototype = Object.create(GenericItem.prototype);
Resource.constructor = Resource;
Resource.prototype.superconstructor = GenericItem; 

function Food(fname, weight, age) {
    GenericItem.call(this, fname, weight);     
    this.age = age;
}
Food.prototype.getAge = function() { return this.age; };
Food.prototype = Object.create(GenericItem.prototype);
Food.constructor = Food;
Food.prototype.superconstructor = GenericItem;  


// inventory
function Inventory(capacity, itemQuantityCollection) {
	this.id = seeds.inventoryModelIdSeed++;
	this.capacity = capacity; //weight-based inventory model
	this.itemQuantityCollection = itemQuantityCollection;
}
Inventory.prototype.getRemainingCapacity = function() { 
	var currentWeight = 0;
	for (var i in this.itemQuantityCollection) {
		currentWeight += itemQuantityCollection[i].item.weight * itemQuantityCollection[i].quantity;
	}
	return this.capacity - currentWeight;
};
//Should not call this unless a check to see if this breaches the capacity has been done
Inventory.prototype.addItemsToInventory = function(genericItem, quantity) { 
	if (typeof this.itemQuantityCollection[genericItem.getName()] == "undefined") {
		this.itemQuantityCollection[genericItem.getName()] = {item: genericItem, quantity: quantity};
	}
	else {
		this.itemQuantityCollection[genericItem.getName()].quantity += quantity;
	}
};
Inventory.prototype.removeItemsFromInventory = function(genericItem, quantity) { 
	if (typeof this.itemQuantityCollection[genericItem.getName()] == "undefined") {
		this.itemQuantityCollection[genericItem.getName()] = {item: genericItem, quantity: (0 - quantity)};
	}
	else {
		this.itemQuantityCollection[genericItem.getName()].quantity -= quantity;	
	}
};

/*
 * @terrainType : single terrainType
 * @terrainFeature : terrainFeature array : possible features of this terrain element
 * @terrainModifier : terrainModifier array : possible modifiers to this terrain
 */
function Terrain(terrainType, terrainFeatures, terrainModifiers) {
	this.id = seeds.terrainIdSeed++;
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
}

/*
 *	@ttname : string name
 */
function TerrainType(ttname) {
	this.id = seeds.terrainTypeIdSeed++;
	this.ttname = ttname;
}

/*
 *  @tfname : string name
 *  @description : help text description for feature
 *	@applicableTerrainTypes : terrainType array : where you'd find this feature
 *	@incompatibleTerrainFeatures : terrainFeature array : features this one wouldn't work with
 */
function TerrainFeature(tfname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainFeatures) {
	this.id = seeds.terrainFeatureIdSeed++;
	this.tfname = tfname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainFeatures = incompatibleTerrainFeatures;
}

/*
 *  @tmname : string name
 *  @description : help text description for modifier
 *	@applicableTerrainTypeAndProbabilities : terrainType array : where you'd find this feature
 *	@incompatibleTerrainModifiers : terrainModifier array : modifiers this one wouldn't work with
 */
function TerrainModifier(tmname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainModifiers) {
	this.id = seeds.terrainModifierIdSeed++;
	this.tmname = tmname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainModifiers = incompatibleTerrainModifiers;
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