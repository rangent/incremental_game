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

// function doForage() {
// 	closeJoyrideTips(); //just in case
// 	enableButton("doExplore");
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
// }

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
// INCREMENTAL LOOP
//////////////////////////////////////////////////////////////////////////////

window.setInterval(function(){
	//run every second
	if (DEBUG) {
		$("#cntr").text(++sec);
	}
	
}, constants.TIME_INTERVAL);

