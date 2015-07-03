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
 * @param {Integer} index : index of the settlement, or null if not
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
 * Checks if location is valid first, if it is, it makes the IE
 * @param {InternalLocation} sourceInternalLocation : source internal location
 * @param {String} direction : cardinal direction (lower case) ("north", "northeast", "east", ...)
 * @param {Location} mapLocationToExitTo : can be null if you want to disallow exit
 */
function createConnectedInternalEnvironment(sourceInternalLocation, direction, mapLocationToExitTo) {
	if (!isValidInternalLocation(sourceInternalLocation, direction)) {
		throw "Invalid location, another internal location exists there";
	}
	
	var newInternalLoc = new InternalLocation({}, true, mapLocationToExitTo);
	player.internalEnvironments[newInternalLoc.id] = newInternalLoc;
	//setup directions
	sourceInternalLocation.directions[direction] = newInternalLoc.id;
	newInternalLoc.directions[getOpposingDirection(direction)] = sourceInternalLocation.id;
}

/**
 * Verifies that the intendedDirection is a valid direction for the source location
 */
function isValidInternalLocation(sourceInternalLocation, intendedDirection) {
	//BE: THIS ISN'T WORKING.
	if (sourceInternalLocation.directions.hasOwnProperty(intendedDirection)) {
		return false;
	}
	var internalMap = getInternalEnvironmentMap();
	var attemptedDirection = invertDirection(getPositionOfAttemptedDirection(intendedDirection, null));
	for (var x in internalMap.nodes) {
		var node = internalMap.nodes[x];
		if (node.position.x == attemptedDirection.x && node.position.y == attemptedDirection.y) {
			return false;
		}
	}
	
	return true;
}

/**
 * Gets relative coordinates to current location.
 * @returns "elements" object compatible with Cytoscape.js
 */
function getInternalEnvironmentMap() {
	if (isPlayerInInternalLocation()) {
		var elements = new Object();
		elements.visitedNodes = new Object(); //BE: THIS SHOULD BE { <location id> : {x : <xcoord>, y : <ycoord>}}
		elements.visitedEdges = new Object(); //BE: THIS SHOULD BE { <location id> : {x : <xcoord>, y : <ycoord>}}
		elements.nodes = [];
		elements.edges = [];
		var il = getCurrentInternalLocation();
		buildNodeAndEdgeMap(il, elements);
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
	if (elements.visitedNodes.hasOwnProperty(internalLocation.id)) {
		return;
	}
	
	var nodeLocation = new Object();
	var firstNode = false;
	
	if (Object.keys(elements.visitedNodes).length == 0) {
		//first node case
		nodeLocation = { x: 0, y: 0};
		firstNode = true;
	}
	else {
		//otherwise find where this node should be relative to any previously visited node
		for (var direction in internalLocation.directions) {
			if (elements.visitedNodes.hasOwnProperty(internalLocation.directions[direction])) {
				var visitedNodeLocation = elements.visitedNodes[internalLocation.directions[direction]];
				nodeLocation = { x : visitedNodeLocation.x, y : visitedNodeLocation.y };
				nodeLocation = getPositionOfAttemptedDirection(direction, nodeLocation);
				break;
			}
		}
	}
	
	//add any non-existant edges
	for (var direction in internalLocation.directions) {
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
	//finally add the node
	//BE: DOES THE id NEED TO BE A STRING?
	var node = { data: {id : String(internalLocation.id)}, position : nodeLocation };
	if (firstNode) {
		node.classes = "currentNode";
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