/*
 *	Travel around from and to locations
 */

function doTravel() {
	var selectedTerrainId = $("#availableTerrain").select2("val");
	if (selectedTerrainId != "" && selectedTerrainId != player.currentTerrain) {
		if (typeof player.availableTerrain[player.currentTerrain] === "object") {
			player.availableTerrain[player.currentTerrain].disabled = false;
			player.availableTerrain[player.currentTerrain].text = player.availableTerrain[player.currentTerrain].text.substring(2);
		}

		travelToLocation(selectedTerrainId);
		updateCurrentTerrain();
		player.availableTerrain[player.currentTerrain].text = "* " + player.availableTerrain[player.currentTerrain].text;
		$("#availableTerrain").select2("val", "");
		$("#selectedTerrain").empty();
	}
}