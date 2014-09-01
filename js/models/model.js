/*
 *	Concrete models and relational models for every entity
 */

//////////////////////////////////////////////////////////////////////////////
// CONSTRUCTORS
//////////////////////////////////////////////////////////////////////////////

function ctor_playerAction(aname, available, age) {
	this.id = seeds.actionIdSeed++;
	this.aname = aname;
	this.available = available;
	this.age = age;
}

//ITEM CONSTRUCTOR
function ctor_genericItem(iname, weight) {
	this.id = seeds.itemIdSeed++;
	this.iname = iname;
	this.weight = weight;
}

//VARIOUS ITEM MODELS
function ctor_inventoryModel(capacity, itemArray) {
	this.id = seeds.inventoryModelIdSeed++;
	this.capacity = capacity; //weight-based inventory model
	this.itemArray = itemArray;
}

//RESOURCES
function ctor_resource(rname, rawResource, found, age) {
	this.id = seeds.resourceIdSeed++;
	this.rname = rname;
	this.rawResource = rawResource;
	this.found = found;
	this.age = age;
}

/*
 * @terrainType : single terrainType
 * @terrainFeature : terrainFeature array : possible features of this terrain element
 * @terrainModifier : terrainModifier array : possible modifiers to this terrain
 */
function ctor_terrain(terrainType, terrainFeatures, terrainModifiers) {
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
function ctor_terrainType(ttname) {
	this.id = seeds.terrainTypeIdSeed++;
	this.ttname = ttname;
}

/*
 *  @tfname : string name
 *  @description : help text description for feature
 *	@applicableTerrainTypes : terrainType array : where you'd find this feature
 *	@incompatibleTerrainFeatures : terrainFeature array : features this one wouldn't work with
 */
function ctor_terrainFeature(tfname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainFeatures) {
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
function ctor_terrainModifier(tmname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainModifiers) {
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

//////////////////////////////////////////////////////////////////////////////
// END RELATIONSHIPS
//////////////////////////////////////////////////////////////////////////////