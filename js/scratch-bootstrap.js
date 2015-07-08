// Wrap IIFE around your code
(function($, viewport){

    // Executes only in XS breakpoint
    if( viewport.is('xs') ) {
        setUiFor("xs");
    }
    
    if( viewport.is('sm') ) {
        setUiFor("sm");
    }
    
    if( viewport.is('md') ) {
        setUiFor("md");
    }
    
    if( viewport.is('lg') ) {
        setUiFor("lg");
    }

    //// Executes in SM, MD and LG breakpoints
    //if( viewport.is('>=sm') ) {
    //    $("button").addClass("btn-sm");
    //}
    //
    //// Executes in XS and SM breakpoints
    //if( viewport.is('<md') ) {
    //    $("button").addClass("btn-md");
    //}
    //
    //// Execute code each time window size changes
    //$(window).resize(
    //    viewport.changed(function(){
    //        if( viewport.is('xs') ) {
    //            // ...
    //        }
    //    })
    //);

})(jQuery, ResponsiveBootstrapToolkit);

function setUiFor(uiSize) {
    var buttonClass = "btn-" + uiSize;
    $("button").addClass(buttonClass);
}


$( document ).ready(function() {
    var w = $("#nwbutton").width();
    $("button").width(w);
});