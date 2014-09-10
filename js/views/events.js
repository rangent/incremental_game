/*
 *	CORE EVENT VIEW MODIFICATIONS
 */

function displayDivById(idString) {
	$("#" + idString).show();
}

function disableButton(buttonId) {
	$("#" + buttonId).button({ disabled: true });
}

function enableButton(buttonId) {
	$("#" + buttonId).button({ disabled: false });
}

function clearEventWindow() {
	game.log = [];
	writeGameLog();
}

// log to event window
function log(s) {
	game.log.push(s);
	writeLogLineToEventDiv(s);
}

function writeLogLineToEventDiv(s) {
	$("#eventDiv").prepend("<span class=\"logLine\">" + s + "</span><br/>");
	$(".logline:eq(1)").removeClass("logLine").addClass("oldLogLine");
}

//load from game state
function writeGameLog() {
	$("#eventDiv").empty();
	for (var n = 0 ; n < game.log.length ; n++) {
		writeLogLineToEventDiv(game.log[n]);
	}
}