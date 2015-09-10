/*
 * Internal Environment controller
 */

/**
 * Establish a settled area at the specificed location
 * @param {Location} location : location to establish the new internal location (settlement)
 */
function establishSettledArea(location) {
    establishNewInternalEnvironment(location, true);
}

function establishNewInternalEnvironment(location, isSettlement, internalEnvironmentName) {
	//should not be able to explore if already in an IL, or if an IL is connected to the current terrain
	if (player.currentInternalLocation != null || getTerrainAtCurrentLocation().internalLocation != null) {
		throw "Invalid exploration area!";
	}
	
	if (typeof isSettlement === "undefined" || isSettlement == null) {
		isSettlement = false;
	}
	var terrain = player.availableTerrain[location.y][location.x];
	var bindPoints = (isSettlement) ? null : getOmniBindPoint(); //the "start node" for a wild IE should be an omni bind point
	var internalLocation = new InternalLocation({}, isSettlement, location, internalEnvironmentName, bindPoints);
	internalLocation.originalSegments.push("INITIAL");
	player.internalEnvironments[internalLocation.id] = internalLocation;
    terrain.internalLocation = internalLocation.id;
	if (isSettlement) {
		var settlement = new Settlement(internalLocation);
		player.settlements.push(settlement);
		internalLocation.baseSettlement = settlement.id;
	}
}

/**
 * Have player enter the internal location (settlement), assumes check was done to make sure an internal location is actually there
 * @param {Integer} index : index of the settlement/internal location
 */
function enterInternalLocation(index) { 
	player.currentInternalLocation = index;
	getCurrentInternalLocation().explored = true;
    togglePlayerEnterOrExitInternalLocationActions();
}

/*
 * Some actions should be enabled or disabled based on whether or not player is in a proper venue
 */
function togglePlayerEnterOrExitInternalLocationActions() {
    //if player entering town
    if (playerInTown()) { //will eventually expand this if production buildings are in camps
        playerActions.Forage.availableToPlayer = false;
		playerActions.Explore.availableToPlayer = false;
		playerActions.Expand.availableToPlayer = true;
    }
    //if player exiting town
    else {
        playerActions.Forage.availableToPlayer = true;
		playerActions.Explore.availableToPlayer = true;
		playerActions.Expand.availableToPlayer = false;
    }
}

/*
 * Have player exit a settlement, assumes check was done to make sure player was in a settlement
 */
function exitInternalLocation() {
	var currentInternalLocationId = getCurrentInternalLocation().id;
    player.currentInternalLocation = null;
	getTerrainAtCurrentLocation().internalLocation = currentInternalLocationId;
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
 * @param {InternalLocation} sourceInternalLocation
 * @param {Array of Strings, or Segment} directionArray
 * @param {String} name : name for all the nodes of the internal environment
 * @param {Integer} index : location in the directionArray to start at
 * @param {Boolean} reverseTraversal : should the map be stitched back from the index? Otherwise, just start at the index
 */
function quickstitchInternalEnvironment(sourceInternalLocation, directionArray, name, index, reverseTraversal) {
	var directions = [];
	var segmentName = null;
	
	//get the representation of the direction array (either the Segment's directions, or the directionArray itself):
	if (isType(directionArray,"Segment") ) {
		//fancy Segment object
		verifySegment(directionArray); //quick validation to make sure the segment is structured properly
		
		directions = directionArray.directions;
		segmentName = directionArray.name + "_" + (seeds.insertedSegmentSeed++); //get a unique segment name
	} else {
		directions = directionArray;
		segmentName = "DIRECTIONARRAY_" + directionArray.length + "_" + (seeds.insertedSegmentSeed++); //get a unique direction array name
	}
	
	if (typeof index !== "number") {
		index = 0; //start at the beginning
	}
	if (index >= directions.length) {
		throw "Starting index >= direction array length in quickstitch!";
	}
	if (typeof reverseTraversal === "undefined") {
		reverseTraversal = false;
	}
	
	//determine the direction of quick stitch, and bind point if applicable
	for (var i = index; i < directions.length;) {
		if (i <= 0) { //likely only needs to be ==, but just in case
			reverseTraversal = false; //switch direction, start stitching forward
		}
		var direction = "";
		var bindPoints = null;
		
		if (isType(directions[i],"SegmentBindPointNode")) {
			direction = (reverseTraversal) ? getOpposingDirection(directions[i].direction) : directions[i].direction;
			bindPoints = directions[i].bindPoints;
			if (direction == null) {
				//null direction indicates initial node in a segment
				if (typeof sourceInternalLocation.bindPoints === "undefined" || sourceInternalLocation.bindPoints == null) {
					//if no bind points exist in the (likely newly created) internal location, they should be added to the source IL
					sourceInternalLocation.bindPoints = bindPoints;	
				}
				addSegmentNameToNodeIfNeeded(sourceInternalLocation, segmentName);
				i++;
				continue;
			}
		} else {
			//a vanilla direction (simple string of a direction)
			direction = (reverseTraversal) ? getOpposingDirection(directions[i]) : directions[i];
		}
		sourceInternalLocation = createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, direction, null, true, name, bindPoints, segmentName);
		
		if (reverseTraversal) {
			i--;
		} else {
			i++;
		}
	}
}

/**
 * Checks if location is valid first, if it is, it makes the IE (doesn't create an edge though)
 * @param {InternalLocation} sourceInternalLocation : source internal location
 * @param {String} direction : cardinal direction (lower case) ("north", "northeast", "east", ...)
 * @param {Location} mapLocationToExitTo : can be null if you want to disallow exit
 */
function createConnectedInternalEnvironment(sourceInternalLocation, direction, mapLocationToExitTo, name) {
	//BE: THIS IS NEVER USED FOR NOW.  IF AFTER RANDOM IE GENERATION IS DONE AND THIS ISN'T USED, DELETE IT
	return createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, direction, mapLocationToExitTo, false, name);
}

/**
 * Creates a connection between source node and existing node, or creates a new internal location
 * if none exists already.  If direction is "out", it creates an exit to the outside from sourceInternalLocation.
 * @param {InternalLocation} sourceInternalLocation : source internal location
 * @param {String} direction : cardinal direction (lower case) ("north", "northeast", "east", ...)
 * @param {Location} mapLocationToExitTo : can be null if you want to disallow exit
 * @param {Boolean} shouldStitchEdges : should create a connection between the two rooms if node and location already exist
 * @param {SegmentBindPointNode} bindPoints : bind points the new IL should have (if applicable),
 * 		note: if you stitch into an existing node (stitch edges) bindPoints will be ignored
 * @param {String} segmentName : the segment creating the internal location (added to the IL for debugging)
 */
function createConnectedInternalEnvironmentOrStitchEdges(sourceInternalLocation, direction, mapLocationToExitTo, shouldStitchEdges, name, bindPoints, segmentName) {
	var nodeAtTargetLocation = getInternalLocationFromDirection(sourceInternalLocation, direction);
	if (isLocation(nodeAtTargetLocation)) {
		sourceInternalLocation.location = nodeAtTargetLocation;
		return sourceInternalLocation;
	}
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
			addSegmentNameToNodeIfNeeded(nodeAtTargetLocation, segmentName);
			return nodeAtTargetLocation;
		}
	} else {
		
		//create the new node and link it to current node:
		var newInternalLoc = new InternalLocation({}, sourceInternalLocation.isSettlement, mapLocationToExitTo, name, bindPoints);
		addSegmentNameToNodeIfNeeded(newInternalLoc, segmentName);
		player.internalEnvironments[newInternalLoc.id] = newInternalLoc;
		//setup directions
		sourceInternalLocation.directions[direction] = newInternalLoc.id;
		newInternalLoc.directions[getOpposingDirection(direction)] = sourceInternalLocation.id;
		if (sourceInternalLocation.isSettlement) {
			newInternalLoc.baseSettlement = sourceInternalLocation.baseSettlement;
		}
		return newInternalLoc;
	}
}

function addSegmentNameToNodeIfNeeded(sourceInternalNode, segmentName) {
	if (typeof segmentName === "string" && !($.inArray(segmentName, sourceInternalNode.originalSegments) > -1)) {
		sourceInternalNode.originalSegments.push(segmentName);
	}
}

/**
 * Verifies that the intendedDirection is a valid direction for the source location
 */
function getInternalLocationFromDirection(sourceInternalLocation, intendedDirection) {
	//just return the direction if the current location already has it
	if (sourceInternalLocation.directions.hasOwnProperty(intendedDirection)) {
		return player.internalEnvironments[sourceInternalLocation.directions[intendedDirection]];
	}
	
	//if not, we need to search for it from all the connected nodes in the map
	var internalMap = getInternalEnvironmentMap(sourceInternalLocation);
	
	if (intendedDirection == "out") {
		//if attempting to go "out", get the location from any node in the map
		for (var x in internalMap.nodes) {
			var node = internalMap.nodes[x];
			if (typeof player.internalEnvironments[node.data.id].location === "object" &&
					player.internalEnvironments[node.data.id].location != null) {
				
				return player.internalEnvironments[node.data.id].location;
			}
		}
	} else {
		//otherwise, search the entire map for a position relative to that direction
		//(to create a path between current node and node that would end up in that direction)
		var attemptedDirection = invertDirection(getPositionOfAttemptedDirection(intendedDirection, null));
		for (var x in internalMap.nodes) {
			var node = internalMap.nodes[x];
			if (node.position.x == attemptedDirection.x && node.position.y == attemptedDirection.y) {
				return player.internalEnvironments[node.data.id];
			}
		}
	}
	return null;
}

/**
 * Gets relative coordinates to current location.
 * @returns "elements" object compatible with Cytoscape.js
 */
function getInternalEnvironmentMap(sourceInternalLocation) {
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
		if (DEBUG || internalLocation.explored) {
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

/**
 * Rotates the directions by the angle of rotation (and bind points if passing in a Segment)
 * @param {Array of String directions, or a Segment} directionArray.
 * 		Do not pass in segments directly from internalEnvironmentSegments, use clone(...) to clone them first!
 * @param {Integer} angleOfRotation : angle of rotation, in 45 degree increments
 */
function rotateDirections(directionArray, angleOfRotation) {
	var directions = [];
	
	//get the representation of the direction array (either the Segment's directions, or the directionArray itself):
	if (isType(directionArray,"Segment") ) {
		//fancy Segment object
		directions = directionArray.directions;
	} else {
		directions = directionArray;
	}
	
	for (var i in directions) {
		var direction = null;
		var bindPoint = null;
		
		if (isType(directions[i],"SegmentBindPointNode")) {
			directions[i].direction = getRotatedDirection(directions[i].direction, angleOfRotation);
			bindPoints = directions[i].bindPoints;
			
			for (var j in bindPoints) {
				bindPoints[j].bindDirection = getRotatedDirection(bindPoints[j].bindDirection, angleOfRotation);
			}
		} else {
			directions[i] = getRotatedDirection(directions[i], angleOfRotation);
		}
	}
	return directionArray;
}

var degreesOfRotation = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * @param {String} direction
 * @param {Integer} angleOfRotation : Angle of rotation, in 45 degree increments
 *
 */
function getRotatedDirection(direction, angleOfRotation) {
	//make sure angle is positive
	while (angleOfRotation < 0) {
		angleOfRotation += 360;
	}
	
	while (angleOfRotation > 0) {
		direction = get45DegreeRotatedDirection(direction);
		angleOfRotation -= 45;
	}
	return direction;
}

/**
 * BindPoint array in all direcitons
 */
function getOmniBindPoint() {
	return [new BindPoint("north"), new BindPoint("northeast"), new BindPoint("east"), new BindPoint("southeast"),
			new BindPoint("south"), new BindPoint("southwest"), new BindPoint("west"), new BindPoint("northwest")];
}

/*
 * SEGMENT BINDING FUNCTIONS:
 */

/**
 * Main algorithm to bind 2 segments together.  Inputs must be valid segments (can be rotated however)
 * @param {InternalLocation} il : an internal location, it should be a regular internal location with bind points and everything 
 * @param {Segment} segment : segment to bind to the existing internal location
 *
 * Usage example:
 * 		bondSegments(getCurrentInternalLocation(), internalEnvironmentSegments["N_S_SHORT01"])
 * 		this will find a way 
 */
function bondSegments(il, segment, segmentName) {
	
	if (!isType(il, "InternalLocation") || !isType(segment, "Segment")) {
		throw "Only allow segments to be bonded!";
	}
	if (!isArray(il.bindPoints)) {
		throw "Source internal location has no bind points!";
	}
	//we dont want to modify segment, we want to modify a copy of it:
	var segmentClone = clone(segment);
	
	//get the connected graph containing the internal location
	var ilgraph = getInternalEnvironmentMap(il);
	
	//pick a bind point from internal location graph
	var chosenNodeAndBindPoint = pickRandomBindPoint(ilgraph);
	//pick a bind point from the segment matching opposite direction from chosen direction
	var chosenSegmentIndex = null;
	var numRotations = 0;
	while (chosenSegmentIndex == null) {
		chosenSegmentIndex = getSegmentIndexFromBindPoint(segmentClone, getOpposingDirection(chosenNodeAndBindPoint.chosenBindDirection));
		if (chosenSegmentIndex == null) {
			//rotate by 45 degrees and try again
			numRotations++;
			segmentClone = rotateDirections(segmentClone, degreesOfRotation[numRotations]);
		}
		if (numRotations >= degreesOfRotation.length) { //we've rotated a full circle and haven't found a bind point...
			debugger;
			throw "Can't connect segment " + segmentClone.name + " to internal location " + il.id + "!"; //TODO: ARE THESE PROPERTIES CORRECT?
		}
	}
	
	//now we have the chosen segment index
	//bind the internal location and the segment (quickstitch)
	var chosenInternalLocation = player.internalEnvironments[chosenNodeAndBindPoint.nodeId];
	var nameForNewSegment = (typeof segmentName === "string") ? chosenInternalLocation.name : segmentName;
	quickstitchInternalEnvironment(chosenInternalLocation, segmentClone, nameForNewSegment, chosenSegmentIndex, true);
	
	//LAZIEST WAY, JUST REMOVE BIND POINTS FROM AN ALERADY BOUND NODE:
	chosenInternalLocation.bindPoints = undefined;
}

/**
 * gets the index of the segment containing the bind point to be bound
 * @returns {Integer} if found, null if no valid bind point found
 */
function getSegmentIndexFromBindPoint(segment, neededDirection) {
	
	if (typeof neededDirection !== "string") {
		throw "Can't find bind point for segment if none provided"
	}
	//first find the weight of all bind points for the given direction
	var weightOfBindPointsInDirection = 0;
	for (var n in segment.directions) {
		var bps = segment.directions[n].bindPoints;
		if (isArray(bps)) {
			for(var b in bps) {
				//only get the weights in the direction we intend
				if (typeof neededDirection == "string" && bps[b].bindDirection == neededDirection) {
					weightOfBindPointsInDirection += bps[b].weight;
				}
			}
		}
	}
	if (weightOfBindPointsInDirection == 0) {
		//if no valid bind point is found in the given neededDirection, return null indicating nothing found
		return null; 
	}
	
	//if something was found in the direction, pick a random number:
	var rnum = rand(1, weightOfBindPointsInDirection * 3) % weightOfBindPointsInDirection;
	//then find the index of the segment with the bind point associated with the direction
	while (rnum >= 0) {
		for (var index in segment.directions) {
			var bps = segment.directions[index].bindPoints;
			if (isArray(bps)) {
				for(var b in bps) {
					//only get the weights in the direction we intend
					if (typeof neededDirection == "string" && bps[b].bindDirection == neededDirection) {
						rnum -= bps[b].weight;
					}
					if (rnum <= 0) {
						return index;
					}
				}
			}
		}
	}
	throw "Unexpected case when finding bind point index";
}

/**
 * Given a network graph (provided by getInternalEnvironmentMap), pick a random node and bind point
 * @param {Object} ilgraph : graph created by getInternalEnvironmentMap
 * @param {String} neededDirection : (Optional) direction of bind point needed
 * @returns {Object} : simple object with nodeId and chosenBindDirection properties
 */
function pickRandomBindPoint(ilgraph, neededDirection) {
	
	//first: get the total weights of all bind points
	var totalWeight = getBindPointWeightsInGraph(ilgraph, neededDirection);
	//verify there is actually an available bind point in needed direction (if needed)
	if (totalWeight == 0) {
		//because of the awful randomness needed to generate internal environments, we can get ourselves into
		//situations where we've destroyed all of the bind points.  As a result, this can occur... :(
		//TODO: RECREATE A BIND POINT AT THE ORIGIN?
		throw "Cannot find a " + neededDirection + " bind point in internal location graph";
	}
	
	//at this point we're guaranteed to have a bind point in the given direction in the il graph (if one defined)
	//now pick a random bind point (from all or just the given direction)
	var rnum = rand(1, totalWeight * 3) % totalWeight;
	
	return getNodeAndBindPointFromRandNumber(ilgraph, neededDirection, rnum);
}

/**
 * returns total weight of bind points of graph (in given direction if neededDirection is defined)
 */
function getBindPointWeightsInGraph(ilgraph, neededDirection) {
	var weightOfBindPointsInDirection = 0;
	for (var n in ilgraph.nodes) {
		var internalLocationId = ilgraph.nodes[n].data.id;
		var bps = player.internalEnvironments[internalLocationId].bindPoints;
		if (isArray(bps)) {
			for(var b in bps) {
				//only get the weights in the direction we intend
				if (typeof neededDirection == "string" && bps[b] == neededDirection) {
					weightOfBindPointsInDirection += bps[b].weight;
				} else if (typeof neededDirection === "undefined" || neededDirection == null) {
					//if no direction specified, get all directions 
					weightOfBindPointsInDirection += bps[b].weight;
				}
			}
		}
	}
	return weightOfBindPointsInDirection;
}

function getNodeAndBindPointFromRandNumber(ilgraph, neededDirection, rnum) {
	
	//build the object to return
	var chosenNodeAndBindPoint = new Object();
	
	while (rnum >= 0) {
		for (var n in ilgraph.nodes) {
			var internalLocationId = ilgraph.nodes[n].data.id;
			var bps = player.internalEnvironments[internalLocationId].bindPoints;
			if (isArray(bps)) {
				for(var b in bps) {
					//only get the weights in the direction we intend
					if (typeof neededDirection == "string" && bps[b] == neededDirection) {
						rnum -= bps[b].weight;
					} else if (typeof neededDirection === "undefined" || neededDirection == null) {
						//if no direction specified, get all directions 
						rnum -= bps[b].weight;
					}
					
					if (rnum <= 0) {
						chosenNodeAndBindPoint.nodeId = internalLocationId;
						chosenNodeAndBindPoint.chosenBindDirection = bps[b].bindDirection;
						return chosenNodeAndBindPoint;
					}
				}
			}
		}
	}
	if (typeof chosenNodeAndBindPoint.chosenBindDirection === "undefined") {
		debugger;
	}
	return chosenNodeAndBindPoint;
}

function getCurrentSettlement() {
	if (!isPlayerInSettlement()) {
		return null;
	} else {
		return player.settlements[getCurrentInternalLocation().baseSettlement];
	}
}

/**
 * Get expansion cost relative to current cost 
 * @param {Integer} relativeIndex : index relative to current cost (0 = current, 1 = next, -1 = previous, etc)
 */
function getExpansionCost(relativeIndex) {
	if (!isPlayerInSettlement()) {
		return null;
	} else {
		var settlementExpansionCostIndex = getCurrentSettlement().currentExpansion + relativeIndex;
		return expansionCosts[settlementExpansionCostIndex];
	}
}

function isPlayerInSettlement() {
	if (!isPlayerInInternalLocation()) {
		return false;
	}
	return getCurrentInternalLocation().isSettlement;
}

function expandSettlement(direction) {
	quickstitchInternalEnvironment(getCurrentInternalLocation(), [direction]);
}