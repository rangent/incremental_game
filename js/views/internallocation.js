/*
 * Internal Location views
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
    /* BE: THIS NEEDS TO BE FIGURED OUT FOR REAL... THIS SORT OF WORKS BUT IS IT NECESSARY?
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
        //TODO: Dynamic generation of the internal environments
        var internalEnvironmentName = "Cave";
        establishNewInternalEnvironment(getCurrentLocation(), false, internalEnvironmentName);
        quickstitchInternalEnvironment(
            player.internalEnvironments[getTerrainAtCurrentLocation().internalLocation],
            internalEnvironmentSegments["WINDING_PATH"],
            internalEnvironmentName);
        log("You discovered a cave!");
        drawTravelDirections();
    } else if (getTerrainAtCurrentLocation().internalLocation != null) {
        logNoSave("You've already found something here!"); //BE: need IE names, then we can tell them what is already here
    }
}