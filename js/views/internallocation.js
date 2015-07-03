/*
 * Internal Location views
 */

function doEnterInternalLocation(index) {
    //TODO: make sure internal location exists
    if (true) {
        enterInternalLocation(index);
        redrawBoard();
    }
}

function doExitInternalLocation() {
    //TODO: dont allow if there isn't a terrain to exit to
    if (true) {
        exitInternalLocation();
        redrawBoard();
    }
}

function drawInternalLocationMap() {
    if (getCurrentInternalLocation() != null) {
        $("#internalMapContainer").show(); 
        cytoscape({
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
                  'background-color': '#61bffc',
                }),
            elements: getInternalEnvironmentMap(),
            autoungrabify: true,
            
            layout: {
                name: 'preset',
                directed: false,
                padding: 10
            }
        });
    } else {
        $("#internalMapContainer").hide();  
    }
}