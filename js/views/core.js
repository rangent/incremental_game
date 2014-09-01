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

function initializeResourceDiv() {
	for (var x in resources) {
		if (resources[x].age <= game.age && resources[x].found) {
			if (resources[x].rawResource) {
				enableResourceInDOM(resources[x].rname, resources[x].total);
			}
		}
	}
}

function initializeActionDiv() {
	for (var x in playerActions) {
		if (playerActions[x].age <= game.age) {
			if (playerActions[x].available) {
				enableActionInDOM(playerActions[x].aname);
			}
		}
	}
}

function initializeTerrainDiv() {
	initializeAvailableTerrain();
	$("#terrainSection").hide();
}

function jqueryifyButtons() {
	$(function() { 
		$( "button" ).button(); 
	});
}

function initializeBoard() { //actually a view function since it calls entirely view functions
	initializeResourceDiv();
	initializeActionDiv();
	initializeTerrainDiv();
	jqueryifyButtons();
}

function initializeAvailableTerrain() {
	$("#availableTerrain").select2({
		placeholder: "Select vacant terrain",
		allowClear: true,
		data: player.availableTerrain
	}); 
	$("#availableTerrain").on("select2-highlight",
		function(e) { 
		    updateTerrainTable(e.choice); }
		);
	$("#availableTerrain").on("change",
		function(e) { 
		    updateTerrainTable(e.added); }
		);
}