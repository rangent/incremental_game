//////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
//////////////////////////////////////////////////////////////////////////////

var sec = 0;
var DEBUG = true;

var constants = {
	TIME_INTERVAL : 1000, //ms
	ACTION_ROW : "<tr><td><button class=\"clearEvent\" onclick=\"do%ACTION%();\" id=\"do%ACTION%\">%ACTION%</button></td></tr>",
	RESOURCE_ROW : "<tr class=\"\"><td>%RESOURCE%</td><td id=\"%RESOURCE%_val\">%VAL%</td></tr>", //one day add images here
	EXPLORE_TIP : "<ol id=\"joyrideExplore\"><li id=\"exploreTip\" data-id=\"doExplore\">Click here to explore.  You will need to click multiple times to complete your exploration.	</li></ol>",
	FORAGE_TIP : "<ol id=\"joyrideForage\"><li id=\"forageTip\" data-id=\"doForage\">Click here to forage.  Forging gives you...</li></ol>",
	TERRAIN_TABLE : "<table class=\"terrainTable\"><tr><th colspan=\"2\" id=\"selectedTerrain\">%TERRAIN_NAME%</th></tr><tr><td>Features:</td><td>%FEATURES%</td></tr><tr><td>Special Traits:</td><td>%MODIFIERS%</td></tr></table>",
	MCVERSION : 0.1
}



//////////////////////////////////////////////////////////////////////////////
// LOCATIONS
//////////////////////////////////////////////////////////////////////////////

/*
 *  Update the currently selected terrain in the UI
 *	@terrain : terrain 
 */
function updateTerrainTable(terrain) {
	$("#selectedTerrain").empty();
	var features = "None";
	if (terrain.terrainFeatures.length > 0) {
		features = "";
		for (var t in terrain.terrainFeatures) {
			features += terrain.terrainFeatures[t].tfname + " ";
		}
	}
	var modifiers = "None";
	if (terrain.terrainModifiers.length > 0 ) {
		modifiers = "";
		for (var t in terrain.terrainModifiers) {
			modifiers += "<a title=\""+ terrain.terrainModifiers[t].description + "\" class=\"tooltip\">" + terrain.terrainModifiers[t].tmname + "</a> ";
		}
	}
	var s = constants.TERRAIN_TABLE
		.replace("%TERRAIN_NAME%", terrain.terrainType.ttname)
		.replace("%FEATURES%",features)
		.replace("%MODIFIERS%",modifiers);

	$("#selectedTerrain").append(s);
	$(".tooltip").tooltip();
}

//////////////////////////////////////////////////////////////////////////////
// ACTIONS -> EXPLORE
//////////////////////////////////////////////////////////////////////////////


function doExplore() {
	if ($( "#progressbar" ).progressbar( "value" ) == $( "#progressbar" ).progressbar( "option", "max" )) {
		makeProgressBar(game.nextExploreCost * game.explorePenalty, playerActions.explore, findLand);
	}
	else {
		progress();
	}
}

//////////////////////////////////////////////////////////////////////////////
// ACTIONS -> FORAGE
//////////////////////////////////////////////////////////////////////////////

// var returnResource(resource, count) {
// 	this.resource = resource;
// 	this.count = count;
// }

// function resourceCountAndProbability(resource, count, probability) {
// 	this.resource = resource;
// 	this.count = count;
// 	this.probability = probability;
// }

// function resourcesCollected(resourcesCountsAndProbabilityArray) {
// 	var collected = [];
// 	for (var r in resourcesCountsAndProbabilityArray) {
// 		var found = Math.floor(Math.random() + (resourcesCountsAndProbabilityArray[r].probability));
// 		if (found > 0) {
// 			collected.push(new returnResource(resourcesCountsAndProbabilityArray[r].resource,resourcesCountsAndProbabilityArray[r].count));
// 		}
// 	}
// 	return collected;
// }

function doForage() {
	closeJoyrideTips(); //just in case
	enableButton("doExplore");
	alert("forage not yet implemented");
//NEED TO DESIGN HOW I'M GOING TO FORAGE BEFORE HALFASSING IT LIKE THIS...
////	chance to get wood from foraging?
//	var resourceCountAndProbabilityArray = [ new resourceCountAndProbability(resources.wood, 1, 0.5) ];
//	var resourcesFound = resourcesCollected(resourceCountAndProbabilityArray);
//	if (resourcesFound.length > 0) {
//		var str = "";
//		for (var r in resourcesFound) {
//			str = str + resourcesFound[r].count + " " + resourcesFound[r].resource.rname + " ";
//			resourcesFound[r].resource.total += resourcesFound[r].count;
////			may want to rethink how I'm displaying elements 
//			if (!resourcesFound[r].resource.found) {
//				log("You've found a new element: " + resourcesFound[r].resource.rname + "!");
//				resourcesFound[r].resource.found = true;
//				enableResourceInDOM(resourcesFound[r].resource.rname, resourcesFound[r].resource.total);
//			}
//			else {
//				$("#" + resourcesFound[r].resource.rname + "_val").text(resourcesFound[r].resource.total);
//			}
//		}
//		log("You forage around for a bit, and found: " + str.substring(0,str.length-1) + "!");
//	}
//	else {
//		log("Didn't find anything this time...");
//	}
}

//////////////////////////////////////////////////////////////////////////////
// BUILDABLES
//////////////////////////////////////////////////////////////////////////////
//function costArray(resources) {
//	for (var r in resources) {
//		//...
//	}
//}
//function building(bname, total, age, cost) {
//	this.bname = bname;
//	this.total = total;
//	this.age = age;
//	this.cost = 
//}
//var buildings = {
//
//	hut : 
//
//}

//////////////////////////////////////////////////////////////////////////////
// FUNCTIONS TO INTITIALIZE AND UPDATE VALUES, SETUP BOARD
//////////////////////////////////////////////////////////////////////////////

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


//////////////////////////////////////////////////////////////////////////////
// JOYRIDE STUFFS
//////////////////////////////////////////////////////////////////////////////

function letsJoyride(playerActionName) {
	$("#joyride" + playerActionName).joyride({
		//want to blow away the tip after it completes
		postRideCallback: function(){
			$('.first-joyride-tips').joyride('destroy');
		},
		nextButton : false,
		autoStart : true,
		modal:false,
		expose: false
	  });
}	

function addJoyrideTip(tipConstant) {
	$("#joyrideTips").append(tipConstant);
}

function closeJoyrideTips() {
	$(".joyride-close-tip").click();
}

//////////////////////////////////////////////////////////////////////////////
// PROGRESS BAR
//////////////////////////////////////////////////////////////////////////////

function makeProgressBar(val, playerAction, fxnToRunOnCompletion) {

	var progressbar = $( "#progressbar" );
	var progressLabel = $( ".progress-label" );
	 
    progressbar.progressbar({
      value: 0,
      max: Math.floor(val),
      change: function() {
        progressLabel.text( playerAction.aname + " progress: " + progressbar.progressbar( "value" ) + "/" + progressbar.progressbar( "option", "max" )  );
      },
      complete: function() {
        progressLabel.text( "Complete!" );
        // progressbar.progressbar( "destroy" );
        // $( "#progressbar" ).remove();
        fxnToRunOnCompletion();
      }
    });
    return true;
}

function progress() {
	$(function() {
	  	var val = $( "#progressbar" ).progressbar( "value" ) || 0;

	  	$( "#progressbar" ).progressbar( "value", val + 1 );
	});
}

//////////////////////////////////////////////////////////////////////////////
// CORE EVENT FUNCTIONS
//////////////////////////////////////////////////////////////////////////////
function displayDivById(idString) {
	$("#" + idString).show();
}

function disableButton(buttonId) {
	$("#" + buttonId).button({ disabled: true });
}

function enableButton(buttonId) {
	$("#" + buttonId).button({ disabled: false });
}

function clearEventWindow() {
	$("#eventDiv").empty();
}

// log to event window
function log(s) {
	$("#eventDiv").prepend("<span class=\"logLine\">" + s + "</span><br/>");
	$(".logline:eq(1)").removeClass("logLine").addClass("oldLogLine");
}

//////////////////////////////////////////////////////////////////////////////
// INCREMENTAL LOOP
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second
	
	$("#brup").text(sec++);
	
}, constants.TIME_INTERVAL);

