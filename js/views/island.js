var mapGrid = null;
var strt = null;

/**
 * @param {String} biome
 * @param {Number} elevation
 * @param {Number} moisture
 * @param {Boolean} water
 * @param {Boolean} ocean
 * @param {Boolean} river
 * @param {Integer} riverSize
 * @param {Integer} x
 * @param {Integer} y
 */
function loc(biome, elevation, moisture, water, ocean, river, riverSize, nextRiver, source, voronoiId, x, y) {
    this.biome = biome;
    this.elevation = elevation;
    this.moisture = moisture;
    this.water = water;
    this.ocean = ocean;
    this.river = river;
    this.riverSize = riverSize;
    this.nextRiver = nextRiver;
    this.source = source;
    this.voronoiId = voronoiId;
    this.x = x;
    this.y = y;
}

function generateLand(w, h) {
    var island = MakeIsland(Math.random());
    island.init({
        width: constants.MAP_WIDTH, //BE: SHOULD BE SQRT(NBSITES) - 1
        height: constants.MAP_HEIGHT, //BE: SHOULD BE SQRT(NBSITES) - 1
        perlinWidth: 200,
        perlinHeight: 200,
        allowDebug: false, // if set to true, you can click on the map to enter "debug" mode. Warning : debug mode is slow to initialize, set to false for faster rendering.
        nbSites: w*h, // BE: SHOULD BE WIDTH * HEIGHT numbers of voronoi cell
        sitesDistribution: 'square', // distribution of the site of the voronoi graph : random, square or hexagon
        sitesRandomisation: 0, // BE: KEEP THIS 0, will move each site in a random way (in %), for the square or hexagon distribution to look more random
        nbGraphRelaxation: 0.0, // nb of time we apply the relaxation algo to the voronoi graph (slow !), for the random distribution to look less random
        cliffsThreshold: 0.1,
        lakesThreshold: 0.005, // lake elevation will increase by this value (* the river size) when a new river end inside
        nbRivers: (10000 / 200),
        maxRiversSize: 1,
        shading: 0.00,
        shadeOcean: true
    });
    return island;
}

function generateLandWithMountain(w, h) {
    var Land = generateLand(w, h);
    var num = 0;
    while (!landHasMountain(Land) && ++num < 10) {
        Land = generateLand(w, h);
    }
    //tag each of the cells with an ID
    for (var i = 0; i < Land.diagram.cells.length; i++) {
        Land.diagram.cells[i].vid = i;
    }
    return Land;
}

function verifyLand(Land) {
    //verify Land has all biomes defined
    for (var i in Land.diagram.cells) {
        if (typeof Land.diagram.cells[i].biome === "undefined") {
            debugger;
        }
    }
}

function findInitialStartingPoint(w, h, arr) {
    //find start point			
    var c = new Point(parseInt(w/2), parseInt(h/2));
    var found = false;
    if (arr[c.y][c.x].water) {
        //search northeast for land
        var inWater = true;
        while (inWater) {
            c = c.north();
            inWater = (arr[c.y][c.x].water);
            var c2 = c.east();
            if (inWater && !arr[c2.y][c2.x].water) {
                inWater = false;
                c = c2;
            }
            else {
                c = c2;
            }
        }
    }			
    
    //search southwest for starting point
    while (!found) {
        var c2 = c.south();
        if (arr[c2.y][c2.x].biome == "OCEAN") {
            found = true;
        }
        else {
            c = c2;
        }
        var c2 = c.west();
        if (!found && arr[c2.y][c2.x].biome == "OCEAN") {
            found = true;
        }
        else {
            c = c2;
        }
    }
    return [c.x,c.y];
}

function adjustStartPoint(strt, arr) {
    
    var check = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1]];
    
    //start on a hilltop
    var moved = false;
    for (var c in check) {
        var xcoord = strt[0]+check[c][0];
        var ycoord = strt[1]+check[c][1];
        if (ycoord >= 0 && xcoord >= 0) { //dont think I need to check right or top bounds
            var loc = arr[ycoord][xcoord];
            if (!moved && !loc.water && loc.biome != "BEACH") {
                loc.biome = "HILL";
                loc.water = false;
                loc.river = false;
                strt = [xcoord, ycoord];
                moved = true;
            }
        }
    }
    
    //make sure theres at least one of the following biomes
    var requiredStartingBiomes = ["PLAINS", "FOREST"];
    check = [[1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1], [0,-1], [1,-1],
             [2,0], [2,1], [2,2], [1,2], [0,2], [-1,2], [-2,2], [-2,1], [-2,0],
             [-2,-1], [-2,-2], [-1,-2], [0,-2], [1,-2], [2,-2], [2,-1]];
    for (var c in check) {
        var xcoord = strt[0]+check[c][0];
        var ycoord = strt[1]+check[c][1];
        if (ycoord >= 0 && xcoord >= 0) { //dont think I need to check right or top bounds
            var loc = arr[ycoord][xcoord];
            for (var b in requiredStartingBiomes) {
                if (loc.biome == requiredStartingBiomes[b]) {
                    requiredStartingBiomes.splice(b,1);
                }
            }
        }
    }
    //place any that we need
    for (var c in check) {
        if (requiredStartingBiomes.length > 0) {
            var xcoord = strt[0]+check[c][0];
            var ycoord = strt[1]+check[c][1];
            if (ycoord >= 0 && xcoord >= 0) { //dont think I need to check right or top bounds
                var loc = arr[ycoord][xcoord];
                if (!loc.water && loc.biome != "BEACH") {
                    loc.biome = requiredStartingBiomes.pop();
                    loc.water = false;
                }
            }
        }
    }
    
    return strt;
}

function getBiomeColor(biome) {
    switch(biome) {
        case "OCEAN": return '#82caff';
        case "BEACH": return '#ffe98d';
        case "LAKE": return '#2f9ceb';
        case "MOUNTAIN": return '#535353';
        case "FOREST": return '#a9cca4';
        case "HILL": return '#a49486';
        case "PLAINS": return '#c9dca4';
        default: return '#ffffff';
    }
}

function landHasMountain(Land) {
    var numMtn = 0
    for (var i = 0; i < Land.diagram.cells.length; i++) {
        if (typeof Land.diagram.cells[i].biome === "undefined") {
            debugger;
        }
        if (Land.diagram.cells[i].biome == "MOUNTAIN") {
            if (++numMtn >= 10) {
                return true;
            }
        }
    }
    return false;
}

function cloneIsland(Land, w, h, vidToArrCoords) {
    var arr = new Array(h);
    for (var y = 0; y < h; y++) {
        arr[y] = new Array(w);
        for (var x = 0; x < w; x++) {
            //find the closest one:
            var closestIndex = 0;
            var closestDistance = 100000000;
            var pt = new Point(x, y);
            //extremely inefficient... but it only gets run on setup... so whatever :-/
            for (var i = 0; i < Land.diagram.cells.length; i++) {
                var pt2 = new Point(Land.diagram.cells[i].site.x, Land.diagram.cells[i].site.y);
                var d = distance(pt, pt2);
                if (d < closestDistance) {
                    closestIndex = i;
                    closestDistance = d;
                }
            }
            vidToArrCoords[closestIndex] = x + "," + y;
            var cell = Land.diagram.cells[closestIndex];
            if (typeof cell === "undefined") {
                debugger;
            }
            var river = (typeof cell.river === "undefined") ? false : cell.river;
            var riverSize = (typeof cell.riverSize === "undefined") ? 0 : cell.riverSize;
            if (typeof cell.biome === "undefined") {
                debugger;
            }
            arr[y][x] = new loc(cell.biome, cell.elevation, cell.moisture, cell.water, cell.ocean, river, riverSize, cell.nextRiver, cell.source, cell.site.voronoiId, x, y);
        }
    }
    return arr;
}

function drawMap(arr, strt) {
    
    var cnvs=document.getElementById("land");
    var ctx=cnvs.getContext("2d");
    var xSize = cnvs.width / constants.MAP_WIDTH;
    var ySize = cnvs.height / constants.MAP_HEIGHT;
    
    for (var y = 0; y < constants.MAP_HEIGHT; y++) {
        for (var x = 0; x < constants.MAP_WIDTH; x++) {
            ctx.fillStyle = getBiomeColor(arr[y][x].biome);
            ctx.fillRect(x * xSize, y * ySize, xSize, ySize);
            if (arr[y][x].river) {
                var xctr = x * xSize + (xSize / 2);
                var yctr = y * ySize + (ySize / 2);
                ctx.beginPath();
                ctx.arc(xctr, yctr, (xSize / 2), 0, 2 * Math.PI, false);
                ctx.fillStyle = "#2f9ceb";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    
    ctx.fillStyle="red";
    ctx.fillRect(strt[0] * xSize, strt[1] * ySize, xSize, ySize);
    
}

function drawMiniMap(arr, strt) {
    var minimapSize = 5; //size x size, needs to be odd number
    
    var cnvs=document.getElementById("minimap");
    var ctx=cnvs.getContext("2d");
    var xSize = cnvs.width / minimapSize;
    var ySize = cnvs.height / minimapSize;
    
    for (var y = (strt[1]-((minimapSize-1)/2)); y <= (strt[1]+((minimapSize-1)/2)); y++) {
        for (var x = (strt[0]-((minimapSize-1)/2)); x <= (strt[0]+((minimapSize-1)/2)); x++) {
            if (x < 0 || x >= arr[0].length || y < 0 || y >= arr.length) {
                ctx.fillStyle = 'black';
                ctx.fillRect((x - (strt[0]-((minimapSize-1)/2))) * xSize, (y - (strt[1]-((minimapSize-1)/2))) * ySize, xSize, ySize);
            } else {
                
                if (arr[y][x].river ) {
                    ctx.fillStyle =  getBiomeColor(arr[y][x].biome);	
                    ctx.fillRect((x - (strt[0]-((minimapSize-1)/2))) * xSize, (y - (strt[1]-((minimapSize-1)/2))) * ySize, xSize, ySize);
                    var xctr = (x - (strt[0]-((minimapSize-1)/2))) * xSize + (xSize / 2);
                    var yctr = (y - (strt[1]-((minimapSize-1)/2))) * ySize + (ySize / 2);
                    ctx.beginPath();
                    ctx.arc(xctr, yctr, (xSize / 2), 0, 2 * Math.PI, false);
                    ctx.fillStyle = "#2f9ceb";
                    ctx.fill();
                    ctx.closePath();
                }
                else {
                    ctx.fillStyle = getBiomeColor(arr[y][x].biome);	
                    ctx.fillRect((x - (strt[0]-((minimapSize-1)/2))) * xSize, (y - (strt[1]-((minimapSize-1)/2))) * ySize, xSize, ySize);
                }
            }
        }
    }
    ctx.fillStyle="red";
    ctx.fillRect(xSize * ((minimapSize-1)/2), ySize * ((minimapSize-1)/2), xSize, ySize);
}

function alignMap(arr, Land, vidToArrCoords) {
    
    var a = new Array(constants.MAP_WIDTH * constants.MAP_HEIGHT);
    for (var i = 0; i < constants.MAP_WIDTH * constants.MAP_HEIGHT; i++) {
        a[i] = 0;
    }
    
    for (var y = 0; y < constants.MAP_HEIGHT; y++) {
        for (var x = 0; x < constants.MAP_WIDTH; x++) {
            a[arr[y][x].voronoiId]++;
        }
    }
    
    //find the ones that aren't mapped to anything
    for (var i = 0; i < constants.MAP_WIDTH * constants.MAP_HEIGHT; i++) {
        if (a[i]==0) {
            vidToArrCoords[i] = Land.diagram.cells[i].site.x + "," + Land.diagram.cells[i].site.y;
        }
    }
}

function distance(a, b) {
    var dx = a.x - b.x,
        dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.north = function() {
    return new Point(this.x, this.y-1);
}
Point.prototype.south = function() {
    return new Point(this.x, this.y+1);
}
Point.prototype.east = function() {
    return new Point(this.x+1, this.y);
}
Point.prototype.west = function() {
    return new Point(this.x-1, this.y);
}

//paper.install(window);
/*
 * @param w {Width} : map's width
 * @param h {Integer} : map's height
 */
function generateAndDrawLand(w, h) {
    
    var Land = generateLandWithMountain(w, h);
    
    //make the array    
    var vidToArrCoords = {};
    mapGrid = cloneIsland(Land, w, h, vidToArrCoords);
    
    strt = findInitialStartingPoint(w, h, mapGrid);
    strt = adjustStartPoint(strt, mapGrid);
    
    alignMap(mapGrid, Land, vidToArrCoords);
    drawMap(mapGrid, strt);
    drawMiniMap(mapGrid, strt);
};