/*
 * Island View
 */


/**
 * Called during initial game setup, this creates the map to be used for the game
 * @param w {Width} : map's width
 * @param h {Integer} : map's height
 * @returns {Object} : object.map a multidimensional array of just the pseudo-terrain
 *      (metrics only, no proper Terrain, modifiers, or features), start: is start location
 */
function generateMap(w, h) {
    
    var Land = generateLandWithMountain(w, h);
    
    //make the array    
    var vidToArrCoords = {};
    var mapGrid = cloneIsland(Land, w, h, vidToArrCoords);
    
    var strt = findInitialStartingPoint(w, h, mapGrid);
    strt = adjustStartPoint(strt, mapGrid);
    
    //make sure every coordinate has a corresponding biome (not quite 1:1 with generated)
    alignMap(mapGrid, Land, vidToArrCoords);
    
    return {map: mapGrid, start: strt};
}

/**
 * @param {Array[][]} mapGrid : player.availableTerrain
 * @param {Location} strt : player.currentLocation (or other location)
 */
function drawMaps(mapGrid, strt) {
    drawMap(mapGrid, strt);
    drawMiniMap(mapGrid, strt);
}