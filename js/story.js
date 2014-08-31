//////////////////////////////////////////////////////////////////////////////
// STORY
//////////////////////////////////////////////////////////////////////////////

function storyStartIntroduceExplore() {
	var time = 0;
	sleep((DEBUG) ? time += 100 : time += 1000, log, "You wake up.");
	sleep((DEBUG) ? time += 100 : time += 3000, log, "Ow... head hurts.  Did you hit it on something?");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "You open your eyes.  Vision.. blurry..");
	sleep((DEBUG) ? time += 100 : time += 4000, log, "Groggily you look around, you are in a strange place.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "Weakly, you get on your feet.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "It's dark.  It's cold.  You can't see much around you.");
	sleep((DEBUG) ? time += 100 : time += 5000, log, "You see a low hill close by that may offer a better view of the area.");
	//introduce "Explore"
	sleep((DEBUG) ? time += 100 : time += 2000, enablePlayerAction, playerActions.explore);
	sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.explore.aname);
	sleep((DEBUG) ? time += 0 : time += 0, addJoyrideTip, constants.EXPLORE_TIP);
	sleep((DEBUG) ? time += 100 : time += 500, letsJoyride, "Explore");
}

function doFirstExplore() {

//	var firstMountain = new terrain(
//		terrainTypes.mountain, 
//		[terrainFeatures.caves], 
//		[terrainModifiers.serene]);
	var firstPlains = new terrain(
		terrainTypes.plains, 
		[], 
		[terrainModifiers.serene]);
	var firstHill = new terrain(
		terrainTypes.hill, 
		[], 
		[terrainModifiers.serene]);

	addTerrainToPlayer(firstPlains);
	addTerrainToPlayer(firstHill);

	var time = 0;
	sleep((DEBUG) ? time += 100 : time += 1000, log, "You weakily walk towards the top of the hill.");
	sleep((DEBUG) ? time += 100 : time += 4000, log, "You crest the hill and get a good view of the surrounding areas.");
	sleep((DEBUG) ? time += 100 : time += 3000, log, "In one direction you see ...");
	///........
	sleep((DEBUG) ? time += 0 : time += 0, displayDivById, "terrainSection");
	sleep((DEBUG) ? time += 100 : time += 2000, log, "Your stomach rumbles.");
	sleep((DEBUG) ? time += 100 : time += 1000, log, "You should forage for something edible.");
	
	//introduce "Forage"
	sleep((DEBUG) ? time += 100 : time += 2000, enablePlayerAction, playerActions.forage);
	sleep((DEBUG) ? time += 0 : time += 0, enableActionInDOM, playerActions.forage.aname);
	sleep((DEBUG) ? time += 0 : time += 0, addJoyrideTip, constants.FORAGE_TIP);
	sleep((DEBUG) ? time += 100 : time += 500, letsJoyride, "Forage");
}