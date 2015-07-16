/*
 *	CORE EVENT VIEW MODIFICATIONS
 */

var keys = {
	shiftPressed : false,
}

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
	$(function() {
		game.log.push(s);
		writeLogLineToEventDiv(s);
	});
}

function logNoSave(s) {
	$(function() {
		writeLogLineToEventDiv(s);	
	});
}

function logAppend(s) {
	game.log[(game.log.length-1)] = game.log[(game.log.length-1)] + s;
	$(".logline:eq(0)").text(game.log[(game.log.length-1)]);
}

function logAppendNoSave(s) {
	$(".logline:eq(0)").text($(".logline:eq(0)").text() + s);
}

function writeLogLineToEventDiv(s) {
	$("#eventDiv").prepend("<span class=\"logline\">" + s + "</span><br/>");
	$(".logline:eq(1)").removeClass("logLine").addClass("oldLogLine");
}

//load from game state
function writeGameLog() {
	$("#eventDiv").empty();
	for (var n = 0 ; n < game.log.length ; n++) {
		writeLogLineToEventDiv(game.log[n]);
	}
}

$(document).on('keyup keydown', 
	function(e) { 
		keys.shiftPressed = e.shiftKey 
	}	
);