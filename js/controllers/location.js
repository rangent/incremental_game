/*
 *	Controller for location functions
 */
 
 /* 
 * @loc : terrain
 */
function addTerrainToPlayer(loc) {
	player.availableTerrain.push(loc);
}

/*
 *	Array of relationships between terrain types and probabilities
 *  @terrainType : terrainType array
 *  @probability : number between 0 and 1 : liklihood of occuring on each of the array of terrain types
 *  @return : terrainTypeProbability array
 */
function terrainTypesAndProbability(terrainTypes, probability) {
	var ret = [];
	for (var t in terrainTypes) {
		ret.push(new rel_terrainTypeProbability(terrainTypes[t], probability));
	}
	return ret;
}

/*
 * @return : terrainType array : all terrain types
 */
function allTerrainTypes() {
	return allTerrainTypesExcept([]);
}

/*
 * @terrainTypes : terrainType array
 * @return : terrainType array : all terrain types (minus terrain types to exclude)
 */
function allTerrainTypesExcept(terrainTypesToExclude) {
	var returnTerrainTypes = [];
	for (var t in terrainTypes) {	
		if ($.inArray(terrainTypes[t], terrainTypesToExclude) == -1) {
			returnTerrainTypes.push(terrainTypes[t]);
		}
	}
	return returnTerrainTypes;
}