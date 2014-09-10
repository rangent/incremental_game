/*
 *	Concrete models and relational models for every entity
 */

//////////////////////////////////////////////////////////////////////////////
// CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

//RESOURCES
function Resource(rname, weight, age) {
	this.id = seeds.itemIdSeed++;
	this.type = "Resource";
	this.name = rname;
	this.weight = weight;
	this.age = age;
}

function Food(fname, weight, age) {
	this.id = seeds.itemIdSeed++;
	this.type = "Food";
	this.name = fname;
	this.weight = weight;   
    this.age = age;
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
 */
function TerrainType(ttname) {
	this.id = seeds.terrainTypeIdSeed++;
	this.type = "TerrainType";
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
	this.type = "TerrainFeature";
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
	this.type = "TerrainModifier";
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