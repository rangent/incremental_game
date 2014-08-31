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

var global = {
	initializedBoard : false,
	storyStartIntroduceExploreed : false,
	playerSetup : false,
	idSetting : 0,
}

//////////////////////////////////////////////////////////////////////////////
// GAME STATE VARIABLES
//////////////////////////////////////////////////////////////////////////////

var game = {
	age : 0,
	nextExploreCost : 10,
	nextExploreCostMultiplier : 1.2,
	explorePenalty : 1, //how difficult exploration will be the next time you explore
}

var player = {
	availableTerrain : [],
}

function getPlayerAvailableTerrain() {

	return player.availableTerrain;
}

//////////////////////////////////////////////////////////////////////////////
// RESOURCES
//////////////////////////////////////////////////////////////////////////////
function resource(rname, rawResource, found, age) {
	this.rname = rname;
	this.rawResource = rawResource;
	this.found = found;
	this.age = age;
}

var resources = {
	//new resource(rname, rawResource, found, age)
	wood 	: new resource('Wood', true, false, 0),
	stone 	: new resource('Stone', true, false, 0),
	dirt 	: new resource('Dirt', true, false, 0),
	water 	: new resource('Water', true, false, 0),
};

//////////////////////////////////////////////////////////////////////////////
// LOCATIONS
//////////////////////////////////////////////////////////////////////////////

/*
 * @terrainType : single terrainType
 * @terrainFeature : terrainFeature array : possible features of this terrain element
 * @terrainModifier : terrainModifier array : possible modifiers to this terrain
 */
function terrain(terrainType, terrainFeatures, terrainModifiers) {
	this.id = global.idSetting++;
	var text = terrainType.ttname;
	if (terrainModifiers.length > 0) {
		for (var t in terrainModifiers) {
			text = terrainModifiers[t].tmname + " " + text;
		}
	}
	if (terrainFeatures.length > 0) {
		text = text +  " (";
		for (var t in terrainFeatures) {
			text = text + terrainFeatures[t].tfname + ", " ;
		}
		text = text.substring(0,text.length-2);
		text += ")";
	}
	this.text = text;
	this.terrainType = terrainType;
	this.terrainFeatures = terrainFeatures;
	this.terrainModifiers = terrainModifiers;
}

/* 
 * @loc : terrain
 */
function addTerrainToPlayer(loc) {
	player.availableTerrain.push(loc);
}

/*
 *	@ttname : string name
 */
function terrainType(ttname) {
	this.ttname = ttname;
}

/*
 *  @terrainType : terrainType
 *  @probability : number between 0 and 1 : liklihood of occuring on that terrain type
 */
function terrainTypeProbability(terrainType, probability) {
	this.terrainType = terrainType;
	this.probability = probability;
}

/*
 *  @terrainType : terrainType array
 *  @probability : number between 0 and 1 : liklihood of occuring on each of the array of terrain types
 *  @return : terrainTypeProbability array
 */
function terrainTypesAndProbability(terrainTypes, probability) {
	var ret = [];
	for (var t in terrainTypes) {
		ret.push(new terrainTypeProbability(terrainTypes[t], probability));
	}
	return ret;
}

/*
 *  @tfname : string name
 *  @description : help text description for feature
 *	@applicableTerrainTypes : terrainType array : where you'd find this feature
 *	@incompatibleTerrainFeatures : terrainFeature array : features this one wouldn't work with
 */
function terrainFeature(tfname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainFeatures) {
	this.tfname = tfname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainFeatures = incompatibleTerrainFeatures;
}

/*
 *  @tmname : string name
 *  @description : help text description for modifier
 *	@applicableTerrainTypeAndProbabilities : terrainType array : where you'd find this feature
 *	@incompatibleTerrainModifiers : terrainModifier array : modifiers this one wouldn't work with
 */
function terrainModifier(tmname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainModifiers) {
	this.tmname = tmname;
	this.description = description;
	this.applicableTerrainTypeAndProbabilities = applicableTerrainTypeAndProbabilities;
	this.incompatibleTerrainModifiers = incompatibleTerrainModifiers;
}

/*
 * @return : terrainType array : all terrain types
 */
function allTerrainTypes() {
	return allTerrainTypesExcept([]);
}

/*
 * @terrainTypes : terrainType array
 * @return : terrainType array : all terrain types (minus terrain types to exclude)
 */
function allTerrainTypesExcept(terrainTypesToExclude) {
	var returnTerrainTypes = [];
	for (var t in terrainTypes) {	
		if ($.inArray(terrainTypes[t], terrainTypesToExclude) == -1) {
			returnTerrainTypes.push(terrainTypes[t]);
		}
	}
	return returnTerrainTypes;
}

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

//ACTUAL TERRAIN TYPES, FEATURES, AND MODIFIERS

var terrainTypes = {
	plains : new terrainType("Plains"),
	mountain : new terrainType("Mountain"),
	hill : new terrainType("Hill"),
	forest : new terrainType("Forest"),
}

var locationTerrainProbabilies = [ 
	new terrainTypeProbability(terrainTypes.plains, 5),
	new terrainTypeProbability(terrainTypes.mountain, 1),
	new terrainTypeProbability(terrainTypes.hill, 1),
	new terrainTypeProbability(terrainTypes.forest, 2),
]

var terrainFeatures = {
	//terrainFeature(tfname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainFeatures)
	caves : new terrainFeature("Caves", "Cave systems make mining easier.", [ new terrainTypeProbability(terrainTypes.mountain, 0.5) ], []),
	river : new terrainFeature("River", "Rivers allow easier travel and increased fertility.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

var terrainModifiers = {
	//terrainModifier(tmname, description, applicableTerrainTypeAndProbabilities, incompatibleTerrainModifiers)
	serene : new terrainModifier("Serene", "Serene locations cannot be attacked by enemies.", terrainTypesAndProbability(allTerrainTypes(), 0.5), []),
}

//////////////////////////////////////////////////////////////////////////////
// ACTIONS
//////////////////////////////////////////////////////////////////////////////
function playerAction(aname, available, age) {
	this.aname = aname;
	this.available = available;
	this.age = age;
}

function enablePlayerAction(playerAction) {
	playerAction.available = true;
}

var playerActions = {
	forage	: new playerAction("Forage", false, 0),
	explore	: new playerAction("Explore", false, 0),
};

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

/*
 * Run after an explore finishes
 */
function findLand() {
	//setup, need to normalize probabilities
	normalizeTerrainTypeProbabilities();
	
	//first pick the land	
	var terrainFound = pickNewLand();

	//then pick the terrain features (if any)
	var terrainFeaturesFound = getFeaturesForTerrainFound(terrainFound);

	var terrainModifiersFound = [];
	for (var t in terrainModifiers) {
		var applicableTerrainTypeArr = terrainModifiers[t].applicableTerrainTypeAndProbabilities;
		for (var a in applicableTerrainTypeArr) {
			if (applicableTerrainTypeArr[a].terrainType == terrainFound) {
				if ((Math.random() - applicableTerrainTypeArr[a].probability) <= 0) {
					terrainModifiersFound.push(terrainModifiers[t]);
				}
			}
		}
	}
	
	var landFoundString =  makePrintableString(terrainFound, terrainModifiersFound, terrainFeaturesFound);

	log("You found a " + landFoundString);
	var foundLand = new terrain( terrainFound, terrainFeaturesFound, terrainModifiersFound);
	addTerrainToPlayer(foundLand);

	//subsequent explorations should be more difficult
	game.nextExploreCost *= game.nextExploreCostMultiplier;
}

function makePrintableString(terrainFound, terrainModifiersFound, terrainFeaturesFound) {
	var landFoundString = "";
	if (terrainModifiersFound.length > 0) {
		for (var t in terrainModifiersFound) {
			landFoundString = landFoundString + terrainModifiersFound[t].tmname.toLowerCase() + ", ";
		}
		landFoundString = landFoundString.substring(0, landFoundString.length-2) + " ";
	}
	landFoundString += terrainFound.ttname.toLowerCase(); 
	if (terrainFeaturesFound.length > 0) {
		landFoundString += " with: ";
		for (var t in terrainFeaturesFound) {
			landFoundString += terrainFeaturesFound[t].tfname.toLowerCase() + ", ";
		}
		landFoundString = landFoundString.substring(0, landFoundString.length-2);
	}
	return landFoundString;
}

function getFeaturesForTerrainFound(terrainFound) {
	var terrainFeaturesFound = [];
	for (var t in terrainFeatures) {
		var applicableTerrainTypeArr = terrainFeatures[t].applicableTerrainTypeAndProbabilities;
		for (var a in applicableTerrainTypeArr) {
			if (applicableTerrainTypeArr[a].terrainType == terrainFound) {
				if ((Math.random() - applicableTerrainTypeArr[a].probability) <= 0) {
					terrainFeaturesFound.push(terrainFeatures[t]);
				}
			}
		}
	}
	return terrainFeaturesFound;
}

/*
 *  Need to normalize the probabilities so they all fall within [0-1) range
 */
function normalizeTerrainTypeProbabilities() {
	//normalize the terrainType probabilities
	var total = 0;
	for (var l in locationTerrainProbabilies) {
		total += locationTerrainProbabilies[l].probability;
	}
	for (var l in locationTerrainProbabilies) {
		locationTerrainProbabilies[l].probability = locationTerrainProbabilies[l].probability / total;
	}
}

function pickNewLand() {
	var terrainFound;
	//after normalized, pick the new land!
	var rand = Math.random();
	for (var l in locationTerrainProbabilies) {
		rand -= locationTerrainProbabilies[l].probability;
		if (rand <= 0) {
			terrainFound = locationTerrainProbabilies[l].terrainType;
			break;
		}
	}
	return terrainFound;
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

function initializeBoard() {
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

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

function sleep(millis, callback, arg1) {
    setTimeout(function()
            { callback(arg1); }
    , millis);
}

function sleep(millis, callback, arg1, arg2) {
    setTimeout(function()
            { callback(arg1, arg2); }
    , millis);
}

//////////////////////////////////////////////////////////////////////////////
// INCREMENTAL LOOP
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second
	
	$("#brup").text(sec++);
	
}, constants.TIME_INTERVAL);

