/*
 *	Controller for explore functions
 */

/*
 * Run after an explore finishes
 * @region : integer : region explored
 */

function findLand(region) {
	//setup, need to normalize probabilities
	normalizeTerrainTypeProbabilities(region);
	
	//pick the land, then get the features and modifiers for it
	var terrainFound = pickNewLand(region);
	var terrainFeaturesFound = getFeaturesForTerrainFound(terrainFound);
	var terrainModifiersFound = getModifiersForTerrainFound(terrainFound);
	
	//get the printable string
	var landFoundString =  makePrintableStringForTerrain(terrainFound, terrainModifiersFound, terrainFeaturesFound);

	log("New location found: " + landFoundString);
	var foundLand = new Terrain( terrainFound, terrainFeaturesFound, terrainModifiersFound);
	addTerrainToPlayer(foundLand);

	//subsequent explorations should be more difficult
	game.nextExploreCost *= game.nextExploreCostMultiplier;
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

/*
 *  Need to normalize the probabilities so they all fall within [0-1) range
 */
function normalizeTerrainTypeProbabilities(region) {
	//normalize the terrainType probabilities
	var total = 0;
	for (var l in locationTerrainProbabilies[region]) {
		total += locationTerrainProbabilies[region][l].probability;
	}
	for (var l in locationTerrainProbabilies[region]) {
		locationTerrainProbabilies[region][l].probability = locationTerrainProbabilies[region][l].probability / total;
	}
}

function pickNewLand(region) {
	var terrainFound;
	//after normalized, pick the new land!
	var rand = Math.random();
	for (var l in locationTerrainProbabilies[region]) {
		rand -= locationTerrainProbabilies[region][l].probability;
		if (rand <= 0) {
			terrainFound = locationTerrainProbabilies[region][l].terrainType;
			break;
		}
	}
	return terrainFound;
}