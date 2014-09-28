//////////////////////////////////////////////////////////////////////////////
// STORY
//////////////////////////////////////////////////////////////////////////////

var storyPhases = [
	//PHASE 0: start story, introduce exploration
	function() {
		var time = 0;
		sleep((DEBUG) ? time += 100 : time += 1000, log, "You wake up.");
		sleep((DEBUG) ? time += 100 : time += 3000, log, "Ow... head hurts.  Did you hit it on something?");
		sleep((DEBUG) ? time += 100 : time += 5000, log, "You open your eyes.  Vision.. blurry..");
		sleep((DEBUG) ? time += 100 : time += 4000, log, "Groggily you look around, you are in a strange place.");
		sleep((DEBUG) ? time += 100 : time += 5000, log, "Weakly, you get on your feet.");
		sleep((DEBUG) ? time += 100 : time += 5000, log, "It's dark.  It's cold.  You can't see much around you.");
		sleep((DEBUG) ? time += 100 : time += 5000, log, "You see a low hill close by that may offer a better view of the area.");
		//introduce "Explore"
		sleep((DEBUG) ? time += 100 : time += 2000, enableActionForPlayer, playerActions.Explore);
		sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.Explore.aname);
		sleep((DEBUG) ? time += 0 : time += 0, checkIfDisableLeftTravelButton);
		sleep((DEBUG) ? time += 0 : time += 0, checkIfDisableRightTravelButton);
		sleep((DEBUG) ? time += 0 : time += 0, addJoyrideTip, constants.EXPLORE_TIP);
		sleep((DEBUG) ? time += 100 : time += 500, letsJoyride, "Explore");
		game.storyPhase++;
	} //end PHASE 0
	,

	//PHASE 1: DO THIS AFTER FIRST EXPLORATION
	function() {
		var time = 0;

		closeJoyrideTips();
		sleep((DEBUG) ? time += 0 : time += 0, disableAction, playerActions.Explore);
		sleep((DEBUG) ? time += 0 : time += 0, disableButton, "doExplore");

		var firstHill = new Terrain(
			terrainTypes.hill, 
			[], 
			[terrainModifiers.serene]);
		setAsHome(firstHill, "Home");

		var time = 0;
		sleep((DEBUG) ? time += 100 : time += 1000, log, "You weakily walk towards the top of the hill.");
		sleep((DEBUG) ? time += 100 : time += 4000, log, "You crest the hill and get a good view of the surrounding areas.");
		sleep((DEBUG) ? time += 100 : time += 3000, log, "The hill is immediately surrounded by plains, but you see an entire unfamiliar world beyond that!");
		sleep((DEBUG) ? time += 0 : time += 0, addTerrainToPlayer, firstHill); 
		sleep((DEBUG) ? time += 0 : time += 0, updateLocationTextBasedOnPlayersLocation);
		sleep((DEBUG) ? time += 0 : time += 0, updateCurrentTerrain);
		sleep((DEBUG) ? time += 0 : time += 0, enableActionForPlayer, playerActions.Travel);
		sleep((DEBUG) ? time += 0 : time += 0, displayDivById, "terrainSection");

		///........
		sleep((DEBUG) ? time += 100 : time += 2000, log, "It's getting cold.");
		sleep((DEBUG) ? time += 100 : time += 1000, log, "You should get some sticks to build a fire.");
		
		//introduce "Forage"
		sleep((DEBUG) ? time += 100 : time += 2000, enableActionForPlayer, playerActions.Forage);
		sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.Forage.aname);
		sleep((DEBUG) ? time += 0 : time += 0, addJoyrideTip, constants.FORAGE_TIP);
		sleep((DEBUG) ? time += 100 : time += 500, letsJoyride, "Forage");
		game.storyPhase++;



		sleep((DEBUG) ? time += 100 : time += 2000, enableActionForPlayer, playerActions.Inventory);

	} //end PHASE 1
	,
	
	//PHASE 2: DO THIS AFTER ENOUGH STUFF TO CRAFT FIREWOOD BUNDLE
	function() {
		var time = 0;
		closeJoyrideTips();
		
		game.storyPhase++;

	} //end PHASE 2
	,
];

function progressStory(phase) {
	if (phase <= game.storyPhase && game.storyPhase < storyPhases.length) {
		storyPhases[game.storyPhase].call();
	}
}