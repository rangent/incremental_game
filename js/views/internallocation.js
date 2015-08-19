/*
 * Internal Location and Expansion views
 */

function doEnterInternalLocation(index) {
    //only allow user to enter internal location accessible from current terrain
    if (DEBUG || getTerrainAtCurrentLocation().internalLocation == index) {
        enterInternalLocation(index);
        redrawTablesAfterLocationChange();
        updateCurrentTerrain();
        if ($("#worldMapTab").attr("aria-expanded")) {
            $("#internalMapTab").click();
        }
    }
}

function doExitInternalLocation() {
    //only allow user to go out if there is an "out" to go out
    if (getCurrentInternalLocation() && getCurrentInternalLocation().location != null) {
        exitInternalLocation();
        redrawTablesAfterLocationChange();
        updateCurrentTerrain();
        if ($("#internalMapTab").attr("aria-expanded")) {
            $("#worldMapTab").click();
        }
    }
}

function drawInternalLocationMap() {
    if (getCurrentInternalLocation() != null) {
        $("#internalMapContainer").show();
        $("#internalMapTab").show();
        //set global cy defined in dataStructures.js
        //Creating a new cytoscape is a huge time sink!  ~150-250ms each time.
        if (typeof cy === "undefined") {
            cy = cytoscape({
                container: document.getElementById('internalMapContainer'),
                
                style: cytoscape.stylesheet()
                    .selector('node')
                    .css({
                        'content': 'data(id)',
                        'shape' : 'roundrectangle'
                    })
                    .selector('edge')
                    .css({
                        'width': 4,
                        'line-color': '#ddd',
                        'target-arrow-color': '#ddd'
                    })
                    .selector('.currentNode')
                    .css({
                      'background-color': '#51aff0',
                    })
                    .selector('.visitedNode')
                    .css({
                      'background-color': '#91dffc',
                    })
                    .selector('.unexploredButAdjacentToExplored')
                    .css({
                      'background-color': '#ddd',
                    })
                    .selector('.unexploredNode')
                    .css({
                      'display': 'none',
                    }),
                elements: getInternalEnvironmentMap(getCurrentInternalLocation()),
                autoungrabify: true,
                
                layout: {
                    name: 'preset',
                    directed: false,
                    padding: 10,
                    fit: true,
                    ready: rezoom(), //BE: this doesn't work... 
                },
                zoom: 2.5,
            });
        } else {
            cy.remove("node");
            cy.add(getInternalEnvironmentMap(getCurrentInternalLocation()));
            cy.fit();
        }
        //rezoom(); BE: do this more predictably if it makes sense
    } else {
        $("#internalMapContainer").hide();
        $("#internalMapTab").hide();
    }
}

function rezoom(zoomLevel) {
    /* TODO: THIS NEEDS TO BE FIGURED OUT FOR REAL...
    zoomLevel = (typeof zoomLevel === "undefined") ? 1.5 : zoomLevel;
    if (typeof cy !== "undefined") {
        //1.5 is good for a mini local map,
        //~1 is good for regular map.
        //Need to do more cytosape js research to determine how to auto zoom.
        cy.zoom(zoomLevel); 
    }
    */
}

function doExplore() {
    if (!isPlayerInInternalLocation() && getTerrainAtCurrentLocation().internalLocation == null) {
        var internalEnvironmentName = "Cave";
        var createdEnv = false;
        var createdEnvAttempt = 0;
        while (!createdEnv && createdEnvAttempt < 10) {
            try {
                establishNewInternalEnvironment(getCurrentLocation(), false, internalEnvironmentName); //gets an omni bindPoint by default
                for (var i = 0; i < constants.NUM_SEGMENTS_FOR_INTERNAL_ENVIRONMENT; i++) {
                    var randomRotationAngle = rand(0,degreesOfRotation.length-1);
                    var segmentIndex = rand(0, Object.keys(internalEnvironmentSegments).length - 1);
                    var segment = clone(internalEnvironmentSegments[Object.keys(internalEnvironmentSegments)[segmentIndex]]);
                    var segmentToQuickstitch = rotateDirections(segment, degreesOfRotation[randomRotationAngle]);
                    
                    bondSegments(player.internalEnvironments[getTerrainAtCurrentLocation().internalLocation], segmentToQuickstitch, internalEnvironmentName);
                    
                }
                createdEnv = true;
                log("You discovered a cave!");
                drawTravelDirections();
            }
            catch (err) {
                //TODO: DANGER!  THIS WILL RESULT IN ORPHAN INTERNAL LOCATIONS!  Should delete instead!
                getTerrainAtCurrentLocation().internalLocation = null;
                createdEnvAttempt++;
                console.log("Couldn't create IE, beginning attempt " + createdEnvAttempt);
            }
        }
        if (createdEnvAttempt >= 10) {
            log("Couldn't find " + internalEnvironmentName + "!")
        }
    } else if (getTerrainAtCurrentLocation().internalLocation != null) {
        logNoSave("You've already found something here!"); //BE: need IE names, then we can tell them what is already here
    }
}

function doExpand() {
    drawExpandDirections();
}

/**
 * @param {String} direction : cardinal direction to expand in
 */
function expand(diretion) {
    if (typeof direction === "string" /*.... forget this... fix this... left off here */ && isPlayerInSettlement() /* && cost = ... deduct(c0st)... */) {
        expandSettlement(direction);
        drawTravelDirections();
        drawInternalLocationMap();
    }
    //else {
    //    throw "Cannot expand, not in a settlement!"; //fix this if we start expanding IEs?
    //}
}

function drawExpandDirections() {
    if (playerActions.Expand.availableToPlayer && playerActions.Expand.actionEnabled && isPlayerInInternalLocation()) {
		var str = "<table>";
        var playerInteralLocation = getCurrentInternalLocation();
		for (var j = -1; j <= 1; j++) {
			str += "<tr>";
			for (var i = -1; i <= 1; i++) {
                
                str += "<td><button type=\"button\" class=\"clearEvent btn btn-default direction-button\" onclick=\"expandSettlement('" + getDirectionFromRelativeLocation(new Location(i, j)) + "')\" ";
				
                //dont allow player to expand where a road already exists
				if (isDirectionTraversable(new Location(i, j), playerInteralLocation)) {
					str += " disabled ";
				}
				str += getArrowForDirection(new Location(i, j)) + "</button></td>";
			}
			str += "</tr>";
		}
		str += "</table>";
	
		//clear expandSection then append
		$("#expandSection").empty().append(str);
		resizePageElements();
	}
}