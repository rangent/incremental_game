//////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
//////////////////////////////////////////////////////////////////////////////

var sec = 0;
var DEBUG = true;

var constants = {
	TIME_INTERVAL : 1000, //ms
	ACTION_ROW : "<tr><td><button class=\"clearEvent\" onclick=\"do%ACTION%();\" id=\"do%ACTION%\">%ACTION%</button></td></tr>",
	RESOURCE_ROW : "<tr class=\"\"><td>%RESOURCE%</td><td id=\"%RESOURCE%_val\">%VAL%</td></tr>", //one day add images here
	MCVERSION : 0.1
}

var global = {
	initializedBoard : false,
	storyStartIntroduceExploreed : false,
	playerSetup : false,
}

//////////////////////////////////////////////////////////////////////////////
// GAME VARIABLES
//////////////////////////////////////////////////////////////////////////////

var game = {
	age : 0

}

//////////////////////////////////////////////////////////////////////////////
// RESOURCES
//////////////////////////////////////////////////////////////////////////////
function resource(rname, total, rawResource, found, age) {
	this.rname = rname;
	this.total = total;
	this.rawResource = rawResource;
	this.found = found;
	this.age = age;
}

var resources = {
	//new resource(name, total, found, age)
	wood 	: new resource('Wood', 0, true, false, 0),
	stone 	: new resource('Stone', 0, true, false, 0),
	dirt 	: new resource('Dirt', 0, true, false, 0),
	water 	: new resource('Water', 0, true, false, 0),
};

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
}

function returnResource(resource, count) {
	this.resource = resource;
	this.count = count;
}

function resourceCountAndProbability(resource, count, probability) {
	this.resource = resource;
	this.count = count;
	this.probability = probability;
}

function resourcesCollected(resourcesCountsAndProbabilityArray) {
	var collected = [];
	for (var r in resourcesCountsAndProbabilityArray) {
		var found = Math.floor(Math.random() + (resourcesCountsAndProbabilityArray[r].probability));
		if (found > 0) {
			collected.push(new returnResource(resourcesCountsAndProbabilityArray[r].resource,resourcesCountsAndProbabilityArray[r].count));
		}
	}
	return collected;
}

function doForage() {
	//chance to get wood from foraging?
	var resourceCountAndProbabilityArray = [ new resourceCountAndProbability(resources.wood, 1, 0.5) ];
	var resourcesFound = resourcesCollected(resourceCountAndProbabilityArray);
	if (resourcesFound.length > 0) {
		var str = "";
		for (var r in resourcesFound) {
			str = str + resourcesFound[r].count + " " + resourcesFound[r].resource.rname + " ";
			resourcesFound[r].resource.total += resourcesFound[r].count;
			//may want to rethink how I'm displaying elements 
			if (!resourcesFound[r].resource.found) {
				log("You've found a new element: " + resourcesFound[r].resource.rname + "!");
				resourcesFound[r].resource.found = true;
				enableResourceInDOM(resourcesFound[r].resource.rname, resourcesFound[r].resource.total);
			}
			else {
				$("#" + resourcesFound[r].resource.rname + "_val").text(resourcesFound[r].resource.total);
			}
		}
		log("You forage around for a bit, and found: " + str.substring(0,str.length-1) + "!");
	}
	else {
		log("Didn't find anything this time...");
	}
}

function doExplore() {
	alert("explore");
}

//////////////////////////////////////////////////////////////////////////////
// STORY
//////////////////////////////////////////////////////////////////////////////

function storyStartIntroduceExplore() {
	var time = 0;
	sleep((DEBUG) ? time += 100 : time += 1000, log, "You wake up.");
	sleep((DEBUG) ? time += 100 : time += 3000, log, "Ow... head hurts.  Did you hit it on something?");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "You open your eyes.  Vision.. blurry..");
	sleep((DEBUG) ? time += 100 : time += 4000, log, "Groggily you look around, you are in a strange place.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "Weakly, you get on your feet.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "It's dark.  It's cold.  You can't see much around you.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "You see a low hill close by that may offer a better view of the area.");
	//introduce "Explore"
	sleep((DEBUG) ? time += 100 : time += 2000, enablePlayerAction, playerActions.explore);
	sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.explore.aname);
	
	
	sleep((DEBUG) ? time += 100 : time += 2000, enablePlayerAction, playerActions.forage);
	sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.forage.aname);
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

function jqueryifyButtons() {
	$(function() { 
		$( "button" ).button(); 
	});
}

function initializeBoard() {
	initializeResourceDiv();
	initializeActionDiv();
	jqueryifyButtons();
}

function setupPlayer() {

}

//////////////////////////////////////////////////////////////////////////////
// CORE EVENT FUNCTIONS
//////////////////////////////////////////////////////////////////////////////

function clearEventWindow() {
	$("#eventDiv").empty();
}

// log to event window
function log(s) {
	$("#eventDiv").prepend(s + "<br/>");
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function sleep(millis, callback, arg1) {
    setTimeout(function()
            { callback(arg1); }
    , millis);
}

//////////////////////////////////////////////////////////////////////////////
// SETUP AND GO!
//////////////////////////////////////////////////////////////////////////////



if (!global.initializedBoard) { 	
	global.initializedBoard = true;
	initializeBoard(); 
}
	
if (!global.storyStartIntroduceExploreed) {
	global.storyStartIntroduceExploreed = true;
	storyStartIntroduceExplore();
}


window.setInterval(function(){
	//run every second
	
	$("#brup").text(sec++);
	
}, constants.TIME_INTERVAL);

