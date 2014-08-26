//////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES
//////////////////////////////////////////////////////////////////////////////

var sec = 0;

var constants = {
	TIME_INTERVAL : 1000 //ms
}

var global = {
	initializedBoard : false,
	storyStarted : false,
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

var playerActions = {
	forage	: new playerAction("Forage", true, 0),
	explore	: new playerAction("Explore", true, 0),
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

function startStory() {
	global.storyStarted = true;
	var time = 1000;
	sleep(time, log, "You wake up");
	time += 1000;
	sleep(time, log, "Groggaly you look around, you are in a strange place");
	time += 1000;
	sleep(time, log, "You stand up");
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

function initializeResourceDiv() {
	var s = "<tr class=\"\"><td>%RESOURCE%</td><td id=\"%RESOURCE%_val\">%VAL%</td></tr>"; //one day add images here
	
	for (var x in resources) {
		if (resources[x].age <= game.age) {
			if (resources[x].rawResource) {
				var sfilled = s.replace("%RESOURCE%",resources[x].rname).replace("%VAL%",resources[x].total);
				$("#resource_container").append(sfilled);
			}
		}
	}
}

function initializeActionDiv() {
	var s = "<tr><td><button class=\"clearEvent\" onclick=\"do%ACTION%();\">%ACTION%</button></td></tr>";
	
	for (var x in playerActions) {
		if (playerActions[x].age <= game.age) {
			if (playerActions[x].available) {
				var sfilled = replaceAll("%ACTION%",playerActions[x].aname,s);
				$("#action_container").append(sfilled);
			}
		}
	}
}

function initializeBoard() {
	initializeResourceDiv();
	initializeActionDiv();
	
	global.initializedBoard = true;
	
	//jqueryify the buttons
	$(function() { 
		$( "button" ).button(); 
	});
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
// FINALLY SETUP AND GO!
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second

	if (!global.initializedBoard) { 
		initializeBoard(); 
	}
	
	if (!global.storyStarted) {
		startStory();
	}
	
	$("#brup").text(sec++);
	
}, constants.TIME_INTERVAL);

