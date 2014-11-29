/*
 *	Controller for explore functions
 */

/*
 * Run after an explore finishes
 * Adds the terrain features and modifiers to the terraintype found, returns full Terrain
 * @ijsloc : loc : a loc generated from island.js
 * @location : Location : coordinate to add the new Terrain to
 */

function createFullLand(ijsloc, location) {
	
    var terrainTypeFound = translateTerrainType(ijsloc.biome);
	
	//get the features and modifiers for the terrainTypeFound
	//add random features
	var terrainFeaturesFound = getFeaturesForTerrainFound(terrainTypeFound);
	//add pre-set features
	addLocFeatures(terrainFeaturesFound, ijsloc);
	//add random modifiers
	var terrainModifiersFound = getModifiersForTerrainFound(terrainTypeFound);
	
	//get the printable string
	var landFoundString =  makePrintableStringForTerrain(terrainTypeFound, terrainModifiersFound, terrainFeaturesFound);

	//log("New location found: " + landFoundString);
	var foundLand = new Terrain( terrainTypeFound, terrainFeaturesFound, terrainModifiersFound, ijsloc, location);
	addTerrainToPlayer(foundLand, location);

	//subsequent explorations should be more difficult TODO: is this still valid?
	//game.nextExploreCost *= game.nextExploreCostMultiplier;
}

function makePrintableStringForTerrain(terrainFound, terrainModifiersFound, terrainFeaturesFound) {
	var landFoundString = "";
	if (terrainModifiersFound.length > 0) {
		for (var t in terrainModifiersFound) {
			landFoundString = landFoundString + terrainModifiersFound[t].tmname.toLowerCase() + ", ";
		}
		landFoundString = landFoundString.substring(0, landFoundString.length-2) + " ";
	}
	landFoundString += terrainFound.ttname.toLowerCase(); 
	if (terrainFeaturesFound.length > 0) {
		landFoundString += " with: ";
		for (var t in terrainFeaturesFound) {
			landFoundString += terrainFeaturesFound[t].tfname.toLowerCase() + ", ";
		}
		landFoundString = landFoundString.substring(0, landFoundString.length-2);
	}
	return landFoundString;
}

function getModifiersForTerrainFound(terrainFound) {
	var terrainModifiersFound = [];
	for (var t in terrainModifiers) {
		var applicableTerrainTypeArr = terrainModifiers[t].applicableTerrainTypeAndProbabilities;
		for (var a in applicableTerrainTypeArr) {
			if (applicableTerrainTypeArr[a].terrainType == terrainFound) {
				if ((Math.random() - applicableTerrainTypeArr[a].probability) <= 0) {
					terrainModifiersFound.push(terrainModifiers[t]);
				}
			}
		}
	}
	return terrainModifiersFound;
}

function getFeaturesForTerrainFound(terrainFound) {
	var terrainFeaturesFound = [];
	for (var t in terrainFeatures) {
		var applicableTerrainTypeArr = terrainFeatures[t].applicableTerrainTypeAndProbabilities;
		for (var a in applicableTerrainTypeArr) {
			if (applicableTerrainTypeArr[a].terrainType == terrainFound) {
				if ((Math.random() - applicableTerrainTypeArr[a].probability) <= 0) {
					terrainFeaturesFound.push(terrainFeatures[t]);
				}
			}
		}
	}
	return terrainFeaturesFound;
}

function addLocFeatures(terrainFeaturesFound, loc) {
	if (loc.river) {
		terrainFeaturesFound.push(terrainFeatures.river);
	}
	if (loc.source) {
		terrainFeaturesFound.push(terrainFeatures.waterSource);
	}
	return terrainFeaturesFound;
}