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
    var cy = cytoscape({
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
            .selector('.highlighted')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),
        elements: { nodes :[{ data :{ id :"0"}, position :{ x :0, y :0}},{ data :{ id :"1"}, position :{ x :-100, y :-100}}], edges :[{ data :{ id :"0-1", weight :1, source :"0", target :"1"}}]},
        autoungrabify: true,
        
        layout: {
            name: 'preset',
            directed: false,
            roots: '#a',
            padding: 10
        }
    });
}