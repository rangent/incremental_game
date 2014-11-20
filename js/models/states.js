/*
 *	Anything containing states for entities used in the game
 */

//global state
var global = {
	storyStarted : false,
	initializedPlayer : false,
	mapGenerated : false,
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
	craftableSeed : 0,
	buildingIdSeed : 0,
	buildableSeed : 0,
	inventoryModelIdSeed : 0,
	settlementIdSeed : 0,
}

//game's state
var game = {
	age : 0,
	nextExploreCost : ((DEBUG) ? 2 : 10),
	nextExploreCostMultiplier : ((DEBUG) ? 1.05 : 1.2),
	explorePenalty : 1, //how difficult exploration will be the next time you explore
	exploreClicks : 0,
	log : [], //array of strings
	storyPhase : 0,
}

//player's state
var player = {
	availableTerrain : null,
	inventory : false,
	atHome : true,
	currentLocation : null, //Location
	settlements : [],
}

/*
 * PlayerAction
 * aname - string
 * availableToPlayer - boolean - has player been exposed to this action yet
 * actionEnabled - boolean - is action currently enabled (should button be enabled)
 * age - integer - age when action becomes available
 */
function PlayerAction(aname, availableToPlayer, actionEnabled, showInActionBar, age) {
	this.id = seeds.actionIdSeed++;
	this.aname = aname;
	this.availableToPlayer = availableToPlayer;
	this.actionEnabled = actionEnabled;
	this.showInActionBar = showInActionBar;
	this.age = age;
}

function getCurrentLocation() {
	return player.availableTerrain[player.currentLocation.y][player.currentLocation.x];
}

function getTerrainAtLocation(location) {
	return player.availableTerrain[location.y][location.x];
}


var playerActions = {
	/*
	Explore	: new PlayerAction("Explore", true, true, true, 0),
	*/
	Forage	: new PlayerAction("Forage", true, true, true, 0),
	Travel  : new PlayerAction("Travel", true, true, false, 0),
	Inventory  : new PlayerAction("Inventory", true, true, false, 0),
	Craft : new PlayerAction("Craft", true, true, true, 0), 
	Build : new PlayerAction("Build", true, true, true, 0), 
};


//for saving and loading the game
//ALL STATE-BASED STUFF MUST BE CRAMMED IN THIS OBJECT FOO'!
var masterState;

function MasterState() {
	this.global = global;
	this.seeds = seeds;
	this.game = game;
	this.player = player;
	this.playerActions = playerActions;
}
MasterState.prototype.updateState = function(global, seeds, game, player, playerActions) {
	this.global = global;
	this.seeds = seeds;
	this.game = game;
	this.player = player;
	this.playerActions = playerActions;
}
MasterState.prototype.setMasterState = function(newMasterState) { 
	global = newMasterState.global;
	seeds = newMasterState.seeds;
	game = newMasterState.game;
	player = newMasterState.player;
	playerActions = newMasterState.playerActions;
	this.updateState(global, seeds, game, player, playerActions);
}