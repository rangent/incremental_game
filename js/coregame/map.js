/*
 * Map functions
 */

/*
 * Converts the island.js-generated map to a full-fledged game map
 * @param m : map generated by islands.js
 */
function initializeMap(m) {
    var j = 0;
    for (var y in m) {
        var i = 0;
        for (var x in m[y]) {
            var l = m[y][x];
            //debugger;
            createFullLand(l, new Location(i, j));
            i++;
        }
        j++;
    }
}

/*
 * Translates island.js locations to game locations
 */
function translateTerrainType(ttstring) {
    switch (ttstring) {
        case "PLAINS" :
            return terrainTypes.plains;
        case "MOUNTAIN" :
            return terrainTypes.mountain;
        case "HILL" :
            return terrainTypes.hill;
        case "OCEAN" :
            return terrainTypes.ocean;
        case "FOREST" :
            return terrainTypes.forest;
        case "BEACH" :
            return terrainTypes.beach;
        case "LAKE" :
            return terrainTypes.lake;
    }
    return null;
}