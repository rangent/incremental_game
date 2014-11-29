/*
 * Save, load, reset, autosave, import, export
 */

function saveState() {
	if (Modernizr.localstorage) {
		masterState.updateState(global, seeds, game, player, playerActions);
		localStorage.setItem("masterState", JSON.stringify(masterState));
		logNoSave("SAVED!");//should add different indicator instead of logging to game window
	}
	else {
		//handle cookies?  No?  Forget it... get a modern browser hippie
	}
}

function loadState() {
	if (Modernizr.localstorage) {
		if (hasSavedGameState()) {
	 		var m = JSON.parse(localStorage.getItem("masterState"));
	 		masterState.setMasterState(m);
	 		logNoSave("LOADED!"); //should add different indicator instead of logging to game window
	 	}
	 	else {
	 		logNoSave("NOTHING TO LOAD!");//should add different indicator instead of logging to game window
	 	}
	}
	else {}
}

function hasSavedGameState() {
	return (null != localStorage.getItem("masterState"));
}

function resetState() {
	if (Modernizr.localstorage) {
		localStorage.removeItem("masterState");
		location.reload();
	}
	else {
		alert("Browser does not support local storage, game cannot save!");
	}
}

function autosave() {
	//TODO
}

function importState() {
	//TODO
}

function exportState() {
	//TODO
}