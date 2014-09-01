/*
 *	Anything containing states for entities used in the game
 */

//global state
var global = {
	initializedBoard : false,
	storyStarted : false,
	initializedPlayer : false,
}

//seeds for entities
var seeds = {
	actionIdSeed : 0,
	resourceIdSeed : 0,
	terrainIdSeed : 0,
	terrainTypeIdSeed : 0,
	terrainFeatureIdSeed : 0,
	terrainModifierIdSeed : 0,
	itemIdSeed : 0,
	inventoryModelIdSeed : 0,
}

//game's state
var game = {
	age : 0,
	nextExploreCost : 10,
	nextExploreCostMultiplier : 1.2,
	explorePenalty : 1, //how difficult exploration will be the next time you explore
	exploreClicks : 0,
}

//player's state
var player = {
	availableTerrain : [],
	inventory : [],
	foundItems : [],
	currentRegion : 0,
	atHome : true,
}

//for saving and loading the game
//ALL STATE-BASED STUFF MUST BE CRAMMED IN THIS OBJECT FOO'!
var masterState = {
	global : global,
	seeds : seeds,
	game : game,
	player : player,
}