var windowSize = -1;

$( document ).ready(function() {
    var windowSize = getWindowSize();
    var w = $("#nwbutton").width();
    $("button").addClass("btn-" + windowSize);
    $(".direction-button").width(w);
    resizeElements();
});

function getWindowSize() {
    var w = $(window).width();
    if (w >= 1200) {
        return 'lg';
    } else if (w >= 980) {
        return 'md';
    } else if (w >= 768) {
        return 'sm';
    } else {
        return 'xs';
    }
}

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
    $("#mapImage").height($("#mapImage").parent().height() - $("#maincol-tabs").outerHeight());
    $("#eventDiv").height($("#centercol").height() - $("#maincol-tabs").outerHeight() - $("#clearButton").outerHeight() - fudgeFactor);
}


