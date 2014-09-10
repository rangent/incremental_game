/*
 *	Anything containing states for entities used in the game
 */

//global state
var global = {
	storyStarted : false,
	storyPhase : 0,
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
	nextExploreCost : ((DEBUG) ? 2 : 10),
	nextExploreCostMultiplier : ((DEBUG) ? 1.05 : 1.2),
	explorePenalty : 1, //how difficult exploration will be the next time you explore
	exploreClicks : 0,
	log : [], //array of strings
}

//player's state
var player = {
	availableTerrain : [],
	inventory : false,
	foundItems : [],
	currentRegion : 0,
	atHome : true,
	currentTerrain : 0, //availableTerrain's ID
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
PlayerAction.prototype.makeAvailable = function() { this.availableToPlayer = true; };
PlayerAction.prototype.isAvailableToPlayer = function() { return this.availableToPlayer; };
PlayerAction.prototype.enableAction = function() { this.actionEnabled = true; };
PlayerAction.prototype.disableAction = function() { this.actionEnabled = false; };
PlayerAction.prototype.isActionEnabled = function() { return this.actionEnabled; };


var playerActions = {
	forage	: new PlayerAction("Forage", false, true, true, 0),
	explore	: new PlayerAction("Explore", false, true, true, 0),
	travel  : new PlayerAction("Travel", false, true, false, 0),
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
MasterState.prototype.resetMasterState = function() { 

}