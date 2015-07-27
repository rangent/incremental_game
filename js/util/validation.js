/**
 * Static analysis on dataStructures.js's internalEnvironmentSegments
 */
function verifyDataStructures() {
    verifyInternalEnvironmentConstants();
    verifyInternalEnvironmentSegments();
}


function verifyInternalEnvironmentConstants() {
    //at this point InternalEnvironmentConstants does not allow segments, only complete maps
	for (var i in internalEnvironmentConstants) {
        verifySimpleRoute(internalEnvironmentConstants[i]);
    }
}

function verifyInternalEnvironmentSegments() {
    for (var s in internalEnvironmentSegments) {
        if (isType(internalEnvironmentSegments[s],"Segment")) {
            verifySegment(internalEnvironmentSegments[s]);
        }
        else {
            verifySimpleRoute(internalEnvironmentSegments[s]);
        }
    }
}

function verifySimpleRoute(route) {
    for (var d in route) {
        if (!isValidDirection(route[d])) {
            throw "Invalid direction found in simple route during static analysis of internal environments: " + route[d];
        }
    }
}

function verifySegment(segment) {
    verifySegmentName(segment);
    verifyGroups(segment);
    verifyDirections(segment);
}

function verifySegmentName(segment) {
    if (typeof segment.name !== "string" || segment.name.length < 1) {
        throw "Invalid segment name found for segment.";
    }
}

function verifyGroups(segment) {
    var groups = segment.groups;
    for (var g in groups) {
        if ($.inArray(groups[g],segmentGroups) == -1) {
            throw "Found unexpected group " + groups[g] + " in segment " + segment.name;
        }
    }
}

function verifyDirections(segment) {
    var directions = segment.directions;
    //verify directions are of the right form:
	if (!isArray(directions) || typeof directions[0] === "undefined" ) {
		throw "Improperly defined directions, please see model's Segment documentation for help";
	}
    //start node should be null (or direction should be null) as it is implicitly the "origin" or start node of a Segment:
    if (!(directions[0] == null || (directions[0].hasOwnProperty("direction") && directions[0].direction == null)) ) {
        throw "First direction of a segment should be null";
    }
    
    //verify each one of the directions
    for (var d in directions) {
        if (isType(directions[d],"SegmentBindPointNode")) {
            //parts to verify of a SegmentBindPointNode:
            // weighted properly (positive number), the bind point's direction is valid, and bind points are valid
            if (!isValidWeight(directions[d])) {
                throw "Improper SegmentBindPointNode weight for segment " + segment.name;
            }
            if (!isValidDirection(directions[d].direction)) {
                throw "Improper direction " + directions[d].direction + " found in segment " + segment.name;
            }
            if (typeof directions[d].bindPoints === "undefined" || !isValidBindPoints(directions[d])) {
                throw "Improper bind points found for " + segment.name;
            }
        } else {
            if (!isValidDirection(directions[d])) {
                throw "Improper direction " + directions[d] + " found in segment " + segment.name;
            }
        }
    }
    
}

function isValidBindPoints(segmentBindPointNode) {
    var bindPoints = segmentBindPointNode.bindPoints;
    for (var b in bindPoints) {
        if (!isType(bindPoints[b],"BindPoint")) {
            throw "Improper type for bind point";
        }
        if (!isValidDirection(bindPoints[b].bindDirection)) {
            throw "Improper direction found for bind point: " + bindPoints[b].bindDirection;
        }
        if (!isValidWeight(bindPoints[b])) {
            throw "Improper weight for BindPoints " + segment.name;
        }
    }
    return true;
}

function isValidWeight(weightedObject) {
    return typeof weightedObject.weight == "number" && weightedObject.weight > 0;
}

function isValidDirection(direction) {
    switch(direction) {
        case "north":
        case "northeast":
        case "east":
        case "southeast":
        case "south":
        case "southwest":
        case "west":
        case "northwest":
        case null: //null is a valid direction for origins (Segments)
            return true;
        default:
            return false;
    }
}