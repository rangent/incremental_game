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
		}
	}
}

function initializeTerrainDiv() {
	initializeAvailableTerrain();
	if (!playerActions.travel.availableToPlayer) {
		$("#terrainSection").hide();
	}
	else {
		updateCurrentTerrain();
	}
}

function jqueryifyButtons() {
	$(function() { 
		$( "button" ).button(); 
	});
}

function setupInitialProgressBar() {
	//TODO: THIS SHOULD BE STATE-BASED
	makeProgressBar(10, playerActions.explore, progressStory, 0);	
}

function initializeAvailableTerrain() {
	$("#availableTerrain").select2({
		placeholder: "Select travel destination",
		allowClear: true,
		data: player.availableTerrain
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
	jqueryifyButtons();
	setupInitialProgressBar();
	writeGameLog();
}