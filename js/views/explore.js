/*
 *	View for explore action
 */

function doExplore() {
	closeJoyrideTips();
	if ($( "#progressbar" ).progressbar( "value" ) == $( "#progressbar" ).progressbar( "option", "max" )) {
		makeProgressBar(game.nextExploreCost * game.explorePenalty, playerActions.explore, findLand, player.currentRegion);
	}
	else {
		progress();
	}
}