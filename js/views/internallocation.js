/*
 * Internal Location views
 */

function doEnterInternalLocation(index) {
    //TODO: make sure internal location exists
    if (true) {
        enterInternalLocation(index);
        redrawTablesAfterLocationChange();
        updateCurrentTerrain();
    }
}

function doExitInternalLocation() {
    //TODO: dont allow if there isn't a terrain to exit to
    if (true) {
        exitInternalLocation();
        redrawTablesAfterLocationChange();
        updateCurrentTerrain();
    }
}

function drawInternalLocationMap() {
    if (getCurrentInternalLocation() != null) {
        $("#internalMapContainer").show();
        $("#internalMapTab").show();
        //set global cy defined in dataStructures.js
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
        rezoom();
    } else {
        $("#internalMapContainer").hide();
        $("#internalMapTab").hide();
    }
}

function rezoom(zoomLevel) {
    zoomLevel = (typeof zoomLevel === "undefined") ? 1.5 : zoomLevel;
    if (typeof cy !== "undefined") {
        //1.5 is good for a mini local map,
        //~1 is good for regular map.
        //Need to do more cytosape js research to determine how to auto zoom.
        cy.zoom(zoomLevel); 
    }
}