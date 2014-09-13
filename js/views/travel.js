/*
 *	Travel around from and to locations
 */

function doTravel() {
	var selectedTerrainId = $("#availableTerrain").select2("val");
	if (selectedTerrainId != "" && selectedTerrainId != player.currentTerrain) {
		doTravelToLocation(parseInt(selectedTerrainId));
	}
}

function doTravelToLocation(selectedTerrainIdToTravelTo) {
	//logic to "enable" currently selected drop down item if it wasn't the  "select travel destination" item
	//also remove the "* " indicating the player's current location
	if (typeof player.availableTerrain[player.currentTerrain] === "object") {
		player.availableTerrain[player.currentTerrain].disabled = false;
		player.availableTerrain[player.currentTerrain].text = player.availableTerrain[player.currentTerrain].text.substring(2);
	}

	travelToLocation(selectedTerrainIdToTravelTo);
	updateCurrentTerrain();
	player.availableTerrain[player.currentTerrain].text = "* " + player.availableTerrain[player.currentTerrain].text;
	$("#availableTerrain").select2("val", "");
	$("#selectedTerrain").empty();

	checkIfDisableLeftTravelButton();
	checkIfDisableRightTravelButton();
	drawInventoryTable();
}

function travelLeft() {
	if ((player.currentTerrain - 1) >= 0  && 
		typeof player.availableTerrain[player.currentTerrain - 1] === "object") {
		doTravelToLocation(parseInt(player.currentTerrain) - 1);
	}
}

function checkIfDisableLeftTravelButton() {
	if (player.currentTerrain == 0) {
		disableButton("doTravelLeft");
	}
	else {
		enableButton("doTravelLeft");
	}
}

function travelRight() {
	if ((player.currentTerrain + 1) < (player.availableTerrain.length)  && 
		typeof player.availableTerrain[player.currentTerrain + 1] === "object") {
		doTravelToLocation(parseInt(player.currentTerrain) + 1);
	}
}

function checkIfDisableRightTravelButton() {
	if (player.availableTerrain.length == 0 || player.currentTerrain == (player.availableTerrain.length - 1)) {
		disableButton("doTravelRight");
	}
	else {
		enableButton("doTravelRight");
	}
}