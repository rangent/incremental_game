var windowSize = -1;

$( document ).ready(function() {
    var windowSize = getWindowSize();
    var w = $("#nwbutton").width();
    $("button").addClass("btn-" + windowSize);
    $(".direction-button").width(w);
    $("#maincol").height($(window).height() - $("footer").height() - $("header").height());
    $("#mainrow").height($(window).height() - $("footer").height() - $("header").height());
});

function getWindowSize() {
    var w = $(window).width();
    /*if (w >= 1200) {
        return 'lg';
    } else*/ if (w >= 980) {
        return 'md';
    } else if (w >= 768) {
        return 'sm';
    } else {
        return 'xs';
    }
}

$( window ).resize(function() {
    $("#maincol").height($(window).height() - $("footer").height() - $("header").height());
    $("#mainrow").height($(window).height() - $("footer").height() - $("header").height());
});

