/*
 *	View for explore action
 */

function doExplore() {
	if ($( "#progressbar" ).progressbar( "value" ) == $( "#progressbar" ).progressbar( "option", "max" )) {
		makeProgressBar(game.nextExploreCost * game.explorePenalty, playerActions.explore, findLand);
	}
	else {
		progress();
	}
}