/*
 * Save, load, reset, autosave, import, export
 */

 function saveState() {
 	if (Modernizr.localstorage) {
 		masterState.updateState(global, seeds, game, player);
 		localStorage.setItem("masterState", JSON.stringify(masterState));
 	}
 	else {
 		//handle cookies?  No?  Forget it... get a modern browser hippie
 	}
 }

 function loadState() {
	if (Modernizr.localstorage) {
 		var foo = localStorage.getItem("masterState");
 		var m = JSON.parse(foo);
 		debugger;
 		masterState.setMasterState(m);
 	}
 	else {}
 }

 function resetState() {

 }

 function autosave() {

 }

 function importState() {

 }

 function exportState() {

 }