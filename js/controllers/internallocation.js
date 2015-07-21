/*
 * Internal Environment controller
 */

/**
 * Establish a settled area at the specificed location
 * @param {Location} location : location to establish the new internal location (settlement)
 */
function establishSettledArea(location) {
    var terrain = player.availableTerrain[location.y][location.x];
	var settlement = new InternalLocation({}, true, location);
	player.internalEnvironments[settlement.id] = settlement;
    terrain.internalLocation = settlement.id;
    player.settlements.push(settlement);
}

/**
 * Have player enter the internal location (settlement), assumes check was done to make sure an internal location is actually there
 * @param {Integer} index : index of the settlement/internal location
 */
function enterInternalLocation(index) { 
	player.currentInternalLocation = index;
    togglePlayerEnterOrExitInternalLocationActions();
}

/*
 * Some actions should be enabled or disabled based on whether or not player is in a proper venue
 */
function togglePlayerEnterOrExitInternalLocationActions() {
    //if player entering town
    if (playerInTown()) { //will eventually expand this if production buildings are in camps
        playerActions.Forage.availableToPlayer = false;
    }
    //if player exiting town
    else {
        playerActions.Forage.availableToPlayer = true;
    }
}

/*
 * Have player exit a settlement, assumes check was done to make sure player was in a settlement
 */
function exitInternalLocation() {
    player.currentInternalLocation = null;
    togglePlayerEnterOrExitInternalLocationActions();
}

function playerInTown() {
    return isPlayerInInternalLocation() && player.internalEnvironments[player.currentInternalLocation].isSettlement;
}

function isPlayerInInternalLocation() {
	return player.currentInternalLocation != null;
}

/**
 * returns null if not in internal location
 */
function getCurrentInternalLocation() {
	return (isPlayerInInternalLocation()) ? player.internalEnvironments[player.currentInternalLocation] : null;
}


/** 
 * create an internal location based on an array of directions, starting at sourceInternalLocation
 */
function quickstitchInternalEnvironment(sourceInternalLocation, directionArray) {
	for (var i in directionArray) {
		sourceInternalLocation = createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, directionArray[i], null, true);
	}
}

/**
 * Checks if location is valid first, if it is, it makes the IE (doesn't create an edge though)
 * @param {InternalLocation} sourceInternalLocation : source internal location
 * @param {String} direction : cardinal direction (lower case) ("north", "northeast", "east", ...)
 * @param {Location} mapLocationToExitTo : can be null if you want to disallow exit
 */
function createConnectedInternalEnvironment(sourceInternalLocation, direction, mapLocationToExitTo) {
	return createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, direction, mapLocationToExitTo, false);
}

/**
 * Checks if location is valid first, if it is, it makes the IE
 * @param {InternalLocation} sourceInternalLocation : source internal location
 * @param {String} direction : cardinal direction (lower case) ("north", "northeast", "east", ...)
 * @param {Location} mapLocationToExitTo : can be null if you want to disallow exit
 * @param {Boolean} shouldStitchEdges : should create a connection between the two rooms if node and location already exist
 */
function createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, direction, mapLocationToExitTo, shouldStitchEdges) {
	var nodeAtTargetLocation = getInternalLocationFromDirection(sourceInternalLocation, direction);
	if (nodeAtTargetLocation != null) {
		if (!shouldStitchEdges) {
			throw "Invalid location, another internal location exists there";
		} else {
			//an internal location exists, check if we should create an edge between the two internal locations
			//if a node exists in the attempted direction and there is not an edge between the two, create an edge
			if (!sourceInternalLocation.directions.hasOwnProperty(direction)) {
				sourceInternalLocation.directions[direction] = nodeAtTargetLocation.id;
				nodeAtTargetLocation.directions[getOpposingDirection(direction)] = sourceInternalLocation.id;
			}
			return nodeAtTargetLocation;
		}
	}
	
	//create the new node and link it to current node:
	var newInternalLoc = new InternalLocation({}, true, mapLocationToExitTo);
	player.internalEnvironments[newInternalLoc.id] = newInternalLoc;
	//setup directions
	sourceInternalLocation.directions[direction] = newInternalLoc.id;
	newInternalLoc.directions[getOpposingDirection(direction)] = sourceInternalLocation.id;
	return newInternalLoc;
}

/**
 * Verifies that the intendedDirection is a valid direction for the source location
 */
function getInternalLocationFromDirection(sourceInternalLocation, intendedDirection) {
	if (sourceInternalLocation.directions.hasOwnProperty(intendedDirection)) {
		return player.internalEnvironments[sourceInternalLocation.directions[intendedDirection]];
	}
	var internalMap = getInternalEnvironmentMap(sourceInternalLocation);
	var attemptedDirection = invertDirection(getPositionOfAttemptedDirection(intendedDirection, null));
	for (var x in internalMap.nodes) {
		var node = internalMap.nodes[x];
		if (node.position.x == attemptedDirection.x && node.position.y == attemptedDirection.y) {
			return player.internalEnvironments[node.data.id];
		}
	}
	
	return null;
}

/**
 * Gets relative coordinates to current location.
 * @returns "elements" object compatible with Cytoscape.js
 */
function getInternalEnvironmentMap(sourceInternalLocation) {
	if (isPlayerInInternalLocation()) {
		var elements = new Object();
		elements.visitedNodes = new Object(); //THIS SHOULD BE { <location id> : {x : <xcoord>, y : <ycoord>}}
		elements.visitedEdges = new Object(); //THIS SHOULD BE { <location id> : {x : <xcoord>, y : <ycoord>}}
		elements.nodes = [];
		elements.edges = [];
		buildNodeAndEdgeMap(sourceInternalLocation, elements);
		delete elements.visitedNodes;
		delete elements.visitedEdges;
		return elements;
	}
	else
		return { nodes: [], edges: []};
}

/**
 * recursive method to build the node and edge map, called by getInternalEnvironmentMap
 */
function buildNodeAndEdgeMap(internalLocation, elements) {
	//base case: node already exists in visited nodes
	if (elements.visitedNodes.hasOwnProperty(internalLocation.id)) {
		return;
	}
	
	//otherwise, this is a new node:
	var nodeLocation = new Object();
	var firstNode = false;
	var cytoscapeCssClassesNeeded = [];
	
	//if we have no nodes visited, then assume this node is the first node
	if (Object.keys(elements.visitedNodes).length == 0) {
		//first node case, centered at 0,0
		nodeLocation = { x: 0, y: 0};
		firstNode = true;
		cytoscapeCssClassesNeeded.push("currentNode");
	}
	else {
		//For every other node that isn't the first node:
		//First, we need to find where this node should be relative to any previously visited node
		//we only need to find one since everything else in visitedNodes should be relative to this node
		//and we should only be visiting other nodes based on moving away from an existing and previously processed nodes
		for (var direction in internalLocation.directions) { //for each direction of possible travel from this new node
			
			//if we've already visited the node in that direction (have added it to the list of visitedNodes)
			if (elements.visitedNodes.hasOwnProperty(internalLocation.directions[direction])) {
				//then determine where this one should be compared to an existing, already-visited node
				var visitedNodeLocation = elements.visitedNodes[internalLocation.directions[direction]];
				nodeLocation = { x : visitedNodeLocation.x, y : visitedNodeLocation.y };
				nodeLocation = getPositionOfAttemptedDirection(direction, nodeLocation);
				break; //we've determined where the node should be compared to one existing node, break away
			}
		}
		
		//next, add any visited/unvisited CSS classes to these other non-firstNode nodes:
		if (internalLocation.explored) {
			//model.js should be enforcing that "isSettlement" InternalLocations are explored by default
			cytoscapeCssClassesNeeded.push("visitedNode");
		}
		else {
			//need to see if we're adjacent to a visited node
			var adjacentToVisitedNode = false;
			for (var direction in internalLocation.directions) {
				if (player.internalEnvironments[internalLocation.directions[direction]].explored) {
					adjacentToVisitedNode = true;
					break;
				}
			}
			if (adjacentToVisitedNode) {
				cytoscapeCssClassesNeeded.push("unexploredButAdjacentToExplored");
			}
			else {
				cytoscapeCssClassesNeeded.push("unexploredNode");
			}
		}
		
	}
	
	//add any non-existant edges
	for (var direction in internalLocation.directions) {
		//only add an edge if we haven't already added it (all edges are bidrectional, we dont want 2 nodes from every node)
		if (!elements.visitedEdges.hasOwnProperty(String( internalLocation.directions[direction] + "-" + internalLocation.id))) {
			var edgeId = String( internalLocation.id + "-" + internalLocation.directions[direction] );
			var edge = { data: {
				id : edgeId,
				weight : 1,
				source : String(internalLocation.id),
				target : String(internalLocation.directions[direction])
				}}
			elements.edges.push(edge);
			elements.visitedEdges[edgeId] = 1;
		}
	}
	//finally add the node as a "visited node":
	var node = { data: {id : String(internalLocation.id)}, position : nodeLocation };
	node.classes = "";
	for (var c in cytoscapeCssClassesNeeded) {
		node.classes += cytoscapeCssClassesNeeded[c] + " ";
	}
	elements.nodes.push(node);	
	elements.visitedNodes[internalLocation.id] = nodeLocation;
	
	//recursive step:
	for (var direction in internalLocation.directions) {
		buildNodeAndEdgeMap(player.internalEnvironments[internalLocation.directions[direction]], elements);
	}
}

/**
 * needed when getting a position relative to other nodes
 */
function invertDirection(il) {
	il.x = -(il.x);
	il.y = -(il.y);
	return il;
}

/**
 * simple lookup, pass in null for nodeLocation to get a relative locaiton from 0,0
 * Note: coordinate systems assume right and down to be positive axes, and left and up to be negative
 */
function getPositionOfAttemptedDirection(direction, nodeLocation) {
	if (nodeLocation == null || typeof nodeLocation === "undefined") {
		nodeLocation = { x: 0, y: 0};
	}
	switch(direction) {
		//Cytoscape.js's canvas has y-coordinates increasing downwards, x-coordinates increasing right
		//these directions are were the visited node is in relation to the current node
		case "northeast":
			nodeLocation.x -= 100;
			nodeLocation.y += 100;
			break;
		case "north":
			nodeLocation.y += 100;
			break;
		case "northwest":
			nodeLocation.x += 100;
			nodeLocation.y += 100;
			break;
		case "east":
			nodeLocation.x -= 100;
			break;
		case "west":
			nodeLocation.x += 100;
			break;
		case "southeast":
			nodeLocation.x -= 100;
			nodeLocation.y -= 100;
			break;
		case "south":
			nodeLocation.y -= 100;
			break;
		case "southwest":
			nodeLocation.x += 100;
			nodeLocation.y -= 100;
			break;
		default:
			throw "Unexpected direction!";
	}
	return nodeLocation;
}