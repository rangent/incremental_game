/*
 *	Progress bar view modifications
 */
 
function makeProgressBar(val, playerAction, fxnToRunOnCompletion, arg1) {

	var progressbar = $( "#progressbar" );
	var progressLabel = $( ".progress-label" );
	 
    progressbar.progressbar({
      value: 0,
      max: Math.floor(val),
      change: function() {
        progressLabel.text( playerAction.aname + " progress: " + progressbar.progressbar( "value" ) + "/" + progressbar.progressbar( "option", "max" )  );
      },
      complete: function() {
        progressLabel.text( playerAction.aname + " complete!" );
        fxnToRunOnCompletion(arg1);
      }
    });
    return true;
}

function progress() {
	$(function() {
	  	var val = $( "#progressbar" ).progressbar( "value" ) || 0;
	  	$( "#progressbar" ).progressbar( "value", val + 1 );
	});
}