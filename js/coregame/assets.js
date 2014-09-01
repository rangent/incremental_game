//////////////////////////////////////////////////////////////////////////////
// CONCRETE GAME ASSET LISTS
// **NOTE**: these should be treated as *READ ONLY* and should *NEVER*
// maintain state!  Anything needing to maintain state should be put into
// states.js
//////////////////////////////////////////////////////////////////////////////

var playerActions = {
	forage	: new PlayerAction("Forage", false, 0),
	explore	: new PlayerAction("Explore", false, 0),
};

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
	[ //1st is "distant area"
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
	wood 	: new Resource('Wood', 3, 0),
	stone 	: new Resource('Stone', 10, 0),
	// dirt 	: new Resource('Dirt', 5, 0),
	// water 	: new Resource('Water', 3, 0),
	// clay 	: new Resource('Clay', 5, 0),
};

//various kinds of food
var food = {
	apple : new Food("Apple", 1, 0),
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

//////////////////////////////////////////////////////////////////////////////
// END CONCRETE GAME ASSET LISTS
//////////////////////////////////////////////////////////////////////////////