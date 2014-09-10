//////////////////////////////////////////////////////////////////////////////
// CONCRETE GAME ASSET LISTS
// **NOTE**: these should be treated as *READ ONLY* and should *NEVER*
// maintain state!  Anything needing to maintain state should be put into
// states.js
//////////////////////////////////////////////////////////////////////////////

//ACTUAL TERRAIN TYPES, FEATURES, AND MODIFIERS
var terrainTypes = {
	plains 		: new TerrainType("Plains"),
	mountain 	: new TerrainType("Mountain"),
	hill 		: new TerrainType("Hill"),
	forest 		: new TerrainType("Forest"),
}

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

var terrainFeatures = {
	caves : new TerrainFeature("Caves", "Cave systems make simple mining possible.", [ new rel_terrainTypeProbability(terrainTypes.mountain, 0.5) ], []),
	river : new TerrainFeature("River", "Rivers allow easier travel and increased fertility.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

var terrainModifiers = {
	serene : new TerrainModifier("Serene", "Serene locations cannot be attacked by enemies.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

//carriable resources
var rawResources = {
	Wood 	: new Resource("Wood", 3, 0),
	Stone 	: new Resource("Stone", 10, 0),
	// Dirt 	: new Resource("Dirt", 5, 0),
	// Water 	: new Resource("Water", 3, 0),
	// Clay 	: new Resource("Clay", 5, 0),
};

//various kinds of food
var food = {
	Apple : new Food("Apple", 1, 0),
	// carrot : new Food("Carrot", 1, 0),
}

// var equipables = {
// 	hat : new GenericItem("Hat", 1),
// }

var itemLibrary = {
	food : food,
	// equipables : equipables,
	rawResources : rawResources,
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
	else {
		return null; //not found
	}
}

//////////////////////////////////////////////////////////////////////////////
// END CONCRETE GAME ASSET LISTS
//////////////////////////////////////////////////////////////////////////////