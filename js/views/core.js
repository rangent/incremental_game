/*
 *	CORE VIEW FUNCTIONS TO INTITIALIZE AND UPDATE VALUES, SETUP BOARD
 *	BE: MAYBE COMBINE main.js'S OTHER FUNCTIONS INTO HERE
 */
 
function enableResourceInDOM(rname, total) {
	var sfilled = replaceAll("%RESOURCE%",rname,constants.RESOURCE_ROW); 
	sfilled = sfilled.replace("%VAL%",total);
	$("#resource_container").append(sfilled);
}

function enableActionInDOM(aname) {
	var sfilled = replaceAll("%ACTION%",aname,constants.ACTION_ROW);
	$("#action_container").append(sfilled);
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

//BE: MAYBE MERGE THIS WITH ABOVE IF THEY'RE BOTH CALLED FROM THE SAME PLACES
function resizeElements() {
    var centerHeight= $(window).height() - $("footer").height() - $("header").height();
    $("#maincol").height($(window).height() - $("footer").innerHeight() - $("header").innerHeight());
    var centerColHeight = $("#maincol").outerHeight() /*- $("footer").innerHeight()*/;
    $("#eventDiv,#otherContent").height(centerColHeight);
    $("#minimapImage").height((3 * $("#nwbutton").outerHeight()));
    $("#mainrow").height($("#maincol").height());
    var fudgeFactor = 20; //not sure why I need this yet, some padding I'm not accounting for
    $("#centercol").height($("#maincol").height());
    $("#land,#internalMapContainer").height($("#mainrow").height() - $("#maincol-tabs").outerHeight() - fudgeFactor);
    $("#eventDiv").height($("#mainrow").height() - $("#maincol-tabs").outerHeight() - $("#clearButton").outerHeight() - fudgeFactor);
	if (typeof cy !== "undefined") {
		cy.resize();
		rezoom(1.5);
	}
}

function verifyStateIsGood() {
	verifyDataStructures(); //static analysis
}

function hideDebugBlocksIfNotDebug() {
	if (! (DEBUG == true)) {
		$(".debugBlock").hide();
	}
}

function documentReadyFunctions() {
    resizeElements();
	$('[data-toggle="tooltip"]').tooltip();
}

$( window ).resize(function() {
    resizeElements();
});

// the grand daddy, this should really only be done when doing a full load from scratch!
function redrawBoard() { //initialize *all* DOM elements
	if (masterState.global.boardInitialized) {
		console.log("redrawBoard called again after state already initialized!");
	}
	hideDebugBlocksIfNotDebug();
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