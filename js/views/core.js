/*
 *	CORE VIEW FUNCTIONS TO INTITIALIZE AND UPDATE VALUES, SETUP BOARD
 */
 
function enableResourceInDOM(rname, total) {
	var sfilled = replaceAll("%RESOURCE%",rname,constants.RESOURCE_ROW); 
	sfilled = sfilled.replace("%VAL%",total);
	$("#resource_container").append(sfilled);
}

function enableActionInDOM(aname) {
	var sfilled = replaceAll("%ACTION%",aname,constants.ACTION_ROW);
	$("#action_container").append(sfilled);
	jqueryifyButtons();
}

function initializeActionDiv() {
	$("#action_container").empty();
	for (var x in playerActions) {
		if (playerActions[x].availableToPlayer && playerActions[x].age <= game.age && playerActions[x].showInActionBar) {
			enableActionInDOM(playerActions[x].aname);
			if (!(playerActions[x].actionEnabled)) {
				disableButton("do" + playerActions[x].aname);
			}
		}
	}
}

function initializeTerrainDiv() {
	initializeAvailableTerrain();
	if (!playerActions.Travel.availableToPlayer) {
		$("#terrainSection").hide();
	}
	else {
		if (player.availableTerrain != null) {
			updateCurrentTerrain();
		}
	}
}

function jqueryifyButtons() {
	$(function() { 
		$( "button" ).button(); 
	});
}

/*
 * Redraws the world map, mini map, and internal location map
 */
function redrawMaps() {
	drawMaps(player.availableTerrain, player.currentLocation);
	drawInternalLocationMap();
}

function redrawTravelDirections() {
	drawTravelDirections();
}

function setupInitialProgressBar() {
	makeProgressBar(game.nextExploreCost, playerActions.Explore, progressStory, 0);	
}

function initializeAvailableTerrain() {
	$("#availableTerrain").select2({
		placeholder: "Select travel destination",
		allowClear: true,
		data: player.availableTerrain //TODO: this wont work
	}); 
	$("#availableTerrain").on("select2-highlight",
		function(e) { 
		    updateTargetDestinationTable(e.choice); }
		);
	$("#availableTerrain").on("change",
		function(e) { 
		    updateTargetDestinationTable(e.added); }
		);
}

function showMap() {
	//need to have researching to enable map making to enable ability to view maps
	if (DEBUG) {
		$("#mapContainer").show();
	}
	else {
		$("#mapContainer").hide();
	}
}

//BE: THIS HAS A BAD SMELL.  EVERY TIME WE ADD A BUTTON WE NEED TO RESIZE THEM... HOW CAN WE DO THIS ON BUTTON ADD EVENTS
//AND NOT MANUALLY LIKE THIS EVERY TIME?
function resizePageElements() {
	var windowSize = getWindowSize();
	var w = $("#doTravelNW").width();
	$("button").addClass("btn-" + windowSize);
	$(".direction-button").width(w);
}

// the grand daddy, this should really only be done when doing a full load from scratch!
function redrawBoard() { //initialize *all* DOM elements
	if (masterState.global.boardInitialized) {
		console.log("redrawBoard called again after state already initialized!");
	}
	initializeActionDiv();
	initializeTerrainDiv();
	drawInventoryTable();
	drawCraftingTable();
	drawBuildingTable();
	jqueryifyButtons();
	setupInitialProgressBar();
	writeGameLog();
	redrawMaps();
	showMap();
	redrawTravelDirections();
	initializeCategoryTreeUi(); //first initialize the tree
	updateCategoryTreeUi(); //then fill in the inventory
	drawInternalLocationMap();
	resizePageElements();
	masterState.global.boardInitialized = true;
}