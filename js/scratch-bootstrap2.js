var windowSize = -1;

$( document ).ready(function() {
    resizeElements();
	$('[data-toggle="tooltip"]').tooltip();
});


$( window ).resize(function() {
    resizeElements();
});

function resizeElements() {
    var centerHeight= $(window).height() - $("footer").height() - $("header").height();
    $("#maincol").height($(window).height() - $("footer").innerHeight() - $("header").innerHeight());
    var centerColHeight = $("#maincol").outerHeight() /*- $("footer").innerHeight()*/;
    $("#eventDiv,#otherContent").height(centerColHeight);
    $("#minimapImage").height((3 * $("#nwbutton").outerHeight()));
    $("#mainrow").height($("#maincol").height());
    var fudgeFactor = 20; //not sure why I need this yet, some padding I'm not accounting for
    $("#centercol").height($("#maincol").height());
    $("#land,#internalMapContainer").height($("#mainrow").height() - $("#maincol-tabs").outerHeight() - fudgeFactor);
    $("#eventDiv").height($("#mainrow").height() - $("#maincol-tabs").outerHeight() - $("#clearButton").outerHeight() - fudgeFactor);
	if (typeof cy !== "undefined") {
		cy.resize();
	}
}


