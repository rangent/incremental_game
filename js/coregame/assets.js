//////////////////////////////////////////////////////////////////////////////
// CONCRETE GAME ASSET LISTS
// **NOTE**: these should be treated as *READ ONLY* and should *NEVER*
// maintain state!  Anything needing to maintain state should be put into
// states.js
//////////////////////////////////////////////////////////////////////////////

var playerActions = {
	forage	: new ctor_playerAction("Forage", false, 0),
	explore	: new ctor_playerAction("Explore", false, 0),
};

var resources = {
	wood 	: new ctor_resource('Wood', true, false, 0),
	stone 	: new ctor_resource('Stone', true, false, 0),
	dirt 	: new ctor_resource('Dirt', true, false, 0),
	water 	: new ctor_resource('Water', true, false, 0),
};

//ACTUAL TERRAIN TYPES, FEATURES, AND MODIFIERS
var terrainTypes = {
	plains 		: new ctor_terrainType("Plains"),
	mountain 	: new ctor_terrainType("Mountain"),
	hill 		: new ctor_terrainType("Hill"),
	forest 		: new ctor_terrainType("Forest"),
}

var locationTerrainProbabilies = [ 
	new rel_terrainTypeProbability(terrainTypes.plains, 5),
	new rel_terrainTypeProbability(terrainTypes.mountain, 1),
	new rel_terrainTypeProbability(terrainTypes.hill, 1),
	new rel_terrainTypeProbability(terrainTypes.forest, 2),
]

var terrainFeatures = {
	caves : new ctor_terrainFeature("Caves", "Cave systems make mining easier.", [ new rel_terrainTypeProbability(terrainTypes.mountain, 0.5) ], []),
	river : new ctor_terrainFeature("River", "Rivers allow easier travel and increased fertility.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

var terrainModifiers = {
	serene : new ctor_terrainModifier("Serene", "Serene locations cannot be attacked by enemies.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

//////////////////////////////////////////////////////////////////////////////
// END CONCRETE GAME ASSET LISTS
//////////////////////////////////////////////////////////////////////////////