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

function redrawMaps() {
	drawMaps(player.availableTerrain, player.currentLocation);	
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

// the grand daddy
function redrawBoard() { //initialize DOM elements
	initializeActionDiv();
	initializeTerrainDiv();
	drawInventoryTable();
	drawCraftingTable();
	drawBuildingTable();
	jqueryifyButtons();
	setupInitialProgressBar();
	writeGameLog();
	redrawMaps();
	redrawTravelDirections();
}