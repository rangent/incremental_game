//////////////////////////////////////////////////////////////////////////////
// CONCRETE GAME ASSET LISTS
// **NOTE**: these should be treated as *READ ONLY* and should *NEVER*
// maintain state!  Anything needing to maintain state should be put into
// states.js
//////////////////////////////////////////////////////////////////////////////

//carriable resources
var rawResources = {
	Wood 	: new Resource("Wood", "Wood", 3, 0),
	Stone 	: new Resource("Stone", "Stone", 10, 0),
	// Dirt 	: new Resource("Dirt", "Dirt", 5, 0),
	// Water 	: new Resource("Water", "Water", 3, 0),
	// Clay 	: new Resource("Clay", "Clay", 5, 0),
};

//various kinds of food
var food = {
	Apple : new Food("Apple", "Apple", 1, 0),
	// carrot : new Food("Carrot", "Carrot", 1, 0),
}

var consumable = {
	Stick : new Consumable("Stick", "Stick", 1, 0),
	FirewoodBundle : new Consumable("FirewoodBundle", "Bundle of Firewood", 6, 0),
    TestHeavyObject  : new Consumable("TestHeavyObject", "TestHeavyObject", 50, 0),
}

var building = {
    // Building(uniqueName, printableName, size, age) {
    Firepit : new Building("Firepit", "Firepit", 1, 0),
	Stockpile : new Building("Stockpile", "Stockpile", 10, 0),
}

var craftable = [
	new Craftable(consumable.FirewoodBundle, 1, [new rel_inventoryQuantity(consumable.Stick, 6)]),
    new Craftable(consumable.TestHeavyObject, 1, [new rel_inventoryQuantity(food.Apple, 1)]),
]

var buildable = [
    //Buildable(building, numProduced, isBuiltInSettlement, isBuiltInWilds, itemIngredientsAndQuantityArray)
    new Buildable(building.Firepit, 1, true, true, [new rel_inventoryQuantity(consumable.FirewoodBundle, 1)]),
	new Buildable(building.Stockpile, 1, true, false, [new rel_inventoryQuantity(consumable.Stick, 1)]),
]

// var equipables = {
// 	hat : new GenericItem("Hat", 1),
// }

var itemLibrary = {
	food : food,
	consumable : consumable,
    building : building,
	craftable : craftable,
    buildable : buildable,
	// equipables : equipables,
	rawResources : rawResources,
}


//ACTUAL TERRAIN TYPES, FEATURES, AND MODIFIERS
var terrainTypes = {
	plains 		: new TerrainType("Plains",{}),
	mountain 	: new TerrainType("Mountain",{}),
	hill 		: new TerrainType("Hill",
			{ "Forage" : new FindProbabilities(0.5, [
				new rel_itemAndQuantityProbability(food.Apple.name, 1, 5),
				new rel_itemAndQuantityProbability(consumable.Stick.name, 1, 5),
				]), 
			}
		),
	forest 		: new TerrainType("Forest",{}),
    ocean       : new TerrainType("Ocean",{}),
    beach       : new TerrainType("Beach",{}),
    lake        : new TerrainType("Lake",{}),
}

/*
var locationTerrainProbabilies = [ 
	[ // 0th is "local"
		new rel_terrainTypeProbability(terrainTypes.plains, 5),
		new rel_terrainTypeProbability(terrainTypes.mountain, 1),
		new rel_terrainTypeProbability(terrainTypes.hill, 1),
		new rel_terrainTypeProbability(terrainTypes.forest, 2),
	],
	[ //1st is "distant area"...
	]
]
*/

//NOTE: The 
var terrainFeatures = {
	caves : new TerrainFeature("Caves", "Cave systems make simple mining possible.", [ new rel_terrainTypeProbability(terrainTypes.mountain, 0.5), new rel_terrainTypeProbability(terrainTypes.hill, 0.1) ], [], {}),
	river : new TerrainFeature("River", "Rivers allow easier travel and increased fertility.", [], [], {}),
    waterSource : new TerrainFeature("Fresh Water Source", "Source of water.", [], [], {}),
}

var terrainModifiers = {
	serene : new TerrainModifier("Serene", "Serene locations cannot be attacked by enemies.", terrainTypesAndProbability(allTerrainTypes(), 0.01), []),
}

/*
 * @itemName - string - unique name of food, raw resource, etc
 */
function getGenericItemAsset(itemName) {
	if (!(typeof food[itemName] === "undefined")) {
		return food[itemName];
	}
	else if (!(typeof rawResources[itemName] === "undefined")) {
		return rawResources[itemName];
	}
	else if (!(typeof consumable[itemName] === "undefined")) {
		return consumable[itemName];
	}
	else {
		return null; //not found
	}
}

//////////////////////////////////////////////////////////////////////////////
// END CONCRETE GAME ASSET LISTS
//////////////////////////////////////////////////////////////////////////////