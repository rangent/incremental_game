/*
 *	Game constants
 */

var constants = {
	TIME_INTERVAL : 1000, //ms
	MCVERSION : 0.1,
	
	//map
	MAP_HEIGHT : 60,
	MAP_WIDTH : 60,
	
	//action bar
	ACTION_ROW : "<tr><td><button class=\"clearEvent\" onclick=\"do%ACTION%();\" id=\"do%ACTION%\">%ACTION%</button></td></tr>",
	
	//inventory area
	RESOURCE_ROW : "<tr class=\"\"><td>%RESOURCE%</td><td id=\"%RESOURCE%_val\">%VAL%</td></tr>", //one day add images here
	INVENTORY_TABLE_INVENTORY_WEIGHT : "<tr><th colspan=\"4\" width=\"100\">Inventory</th><th width=\"100\">Ground</th></tr><tr><td>Weight:</td><td id=\"playerWeight\">%INVENTORY_WEIGHT%</td><td>/</td><td id=\"playerCapacity\">%PLAYER_CAPACITY%</td><td>&nbsp;</td></tr>",
	PLAYER_INVENTORY_ROW : "<tr><td colspan=\"4\"><a title=\"Weight: %ITEM_WEIGHT%\" class=\"tooltip\"><button id=\"%ITEM%Drop\">%ITEM_NAME% (%ITEM_QUANTITY%)</button></a></td>", // onclick=\"dropItem(%CURRENT_LOCATION%, '%ITEM%', 1);\"
	BLANK_PLAYER_INVENTORY_ROW : "<tr><td colspan=\"4\">&nbsp;</td>",
	LOCATION_INVENTORY_ROW : "<td style=\"text-align:right\"><a title=\"Weight: %ITEM_WEIGHT%\" class=\"tooltip\"><button id=\"%ITEM%Pickup\">%ITEM_NAME% (%ITEM_QUANTITY%)</button></a></td></tr>",// onclick=\"pickupItem(%CURRENT_LOCATION%, '%ITEM%', 1);\"
	BLANK_LOCATION_INVENTORY_ROW : "<td colspan=\"4\">&nbsp;</td></tr>",
	
	//Joyride tips
	EXPLORE_TIP : "<ol id=\"joyrideExplore\"><li id=\"exploreTip\" data-id=\"doExplore\">Click here to explore.  You will need to click multiple times to completely explore an area.</li></ol>",
	FORAGE_TIP : "<ol id=\"joyrideForage\"><li id=\"forageTip\" data-id=\"doForage\">Click here to forage.  Forging allows you to find items on the ground where you are.  Search for some sticks to use as firewood.</li></ol>",
	ITEM_FOUND_TIP : "<ol id=\"joyride%ITEM%\"><li id=\"forageTip\" data-id=\"%ITEM%Pickup\">Forage: Found %ITEM%!</li></ol>",
	//ADD_TO_INVENTORY_TIP : "<ol id=\"joyrideResourceTable\"><li id=\"inventoryTip\" data-id=\"ResourceTable\">This is your inventory...</li></ol>",
	
	//terrain
	TERRAIN_TABLE : "<table class=\"terrainTable\"><tr><th colspan=\"2\" id=\"selectedTerrainTable\">%TERRAIN_NAME%</th></tr><tr><td>Features:</td><td>%FEATURES%</td></tr><tr><td>Special Traits:</td><td>%MODIFIERS%</td></tr><tr><td>Buildings:</td><td>%BUILDINGS%</td></tr></table>",
	
	//crafting
	CRAFTABLE_TABLE_HEADER : "<tr><th>Craft</th></tr>",
	CRAFTABLE_ITEM_ROW : "<tr><td><button id=\"%ITEM%Craft\">%ITEM_NAME%</button></td></tr>",
	
	//building
	BUILDABLE_TABLE_HEADER : "<tr><th>Build</th></tr>",
	BUILDABLE_ITEM_ROW : "<tr><td><button id=\"%ITEM%Build\">%ITEM_NAME%</button></td></tr>",
	
}

//////////////////////////////////////////////////////////////////////////////
// DEBUG
//////////////////////////////////////////////////////////////////////////////

var sec = 0;
var DEBUG = true;