/*
 *	Game constants
 */

var constants = {
	TIME_INTERVAL : 1000, //ms
	MCVERSION : "0.0.1",
	
	//map
	MAP_HEIGHT : 60,
	MAP_WIDTH : 60,
	
	//action bar
	ACTION_ROW : "<button class=\"clearEvent btn btn-default btn-lg\" data-toggle=\"modal\" data-target=\"#%ACTION%Modal\" onclick=\"do%ACTION%();\" id=\"do%ACTION%\">%ACTION%</button>",
            //<button class="btn btn-default" data-toggle="modal" data-target="#craftingModal">Craft</button>
	
	//inventory area
	RESOURCE_ROW : "<tr class=\"\"><td>%RESOURCE%</td><td id=\"%RESOURCE%_val\">%VAL%</td></tr>", //one day add images here
	INVENTORY_TABLE_INVENTORY_WEIGHT : "Weight: %INVENTORY_WEIGHT% / %PLAYER_CAPACITY%",
	//<button class="btn btn-default">Apple <span class="badge">5</span></button>
	PLAYER_INVENTORY_BUTTON : "<a title=\"\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-original-title=\"Weight: %ITEM_WEIGHT%\"><button class=\"btn btn-default\" id=\"%ITEM%Drop\">%ITEM_NAME% <span class=\"badge\">%ITEM_QUANTITY%</span></button></a>", // onclick=\"dropItem(%CURRENT_LOCATION%, '%ITEM%', 1);\"
	BLANK_PLAYER_INVENTORY_ROW : "<tr><td colspan=\"4\">&nbsp;</td>",
	LOCATION_INVENTORY_BUTTON : "<a title=\"\" data-toggle=\"tooltip\" data-placement=\"bottom\" data-original-title=\"Weight: %ITEM_WEIGHT%\"><button class=\"btn btn-default\" id=\"%ITEM%Pickup\">%ITEM_NAME% <span class=\"badge\">%ITEM_QUANTITY%</span></button></a>",// onclick=\"pickupItem(%CURRENT_LOCATION%, '%ITEM%', 1);\"
	BLANK_LOCATION_INVENTORY_ROW : "<td colspan=\"4\">&nbsp;</td></tr>",
	
	//Joyride tips
	EXPLORE_TIP : "<ol id=\"joyrideExplore\"><li id=\"exploreTip\" data-id=\"doExplore\">Click here to explore.  You will need to click multiple times to completely explore an area.</li></ol>",
	FORAGE_TIP : "<ol id=\"joyrideForage\"><li id=\"forageTip\" data-id=\"doForage\">Click here to forage.  Forging allows you to find items on the ground where you are.  Search for some sticks to use as firewood.</li></ol>",
	ITEM_FOUND_TIP : "<ol id=\"joyride%ITEM%\"><li id=\"forageTip\" data-id=\"%ITEM%Pickup\">Forage: Found %ITEM%!</li></ol>",
	
	//terrain
	TERRAIN_TABLE : "<table class=\"terrainTable table\"><tr><th colspan=\"2\" id=\"selectedTerrainTable\">%TERRAIN_NAME%</th></tr><tr><td>Features:</td><td>%FEATURES%</td></tr><tr><td>Special Traits:</td><td>%MODIFIERS%</td></tr><tr><td>Buildings:</td><td>%BUILDINGS%</td></tr></table>",
	
	//crafting
	CRAFTABLE_TABLE_HEADER : "<tr><th>Craft</th></tr>",
	CRAFTABLE_ITEM_BUTTON : "<button class=\"btn btn-default\" id=\"%ITEM%Craft\">%ITEM_NAME%</button>",
	
	//building
	BUILDABLE_TABLE_HEADER : "<tr><th>Build</th></tr>",
	BUILDABLE_ITEM_ROW : "<tr><td><button id=\"%ITEM%Build\">%ITEM_NAME%</button></td></tr>",
	
	INVENTORY : {
		WEIGHTED : 0,
		RULEOF99 : 1,
	},
	
	ROOT_CATEGORY : null, //defined in main.js at run time
}

var categoryNames = {
    ROOT : "ROOT",
    RAW : "Raw",
	FOOD : "Food",
	WOOD : "Wood",
	CONSUMABLE : "Consumable",
}

var internalEnvironmentConstants = {
    TOWN1 : ["north", "south", "west", "north","northeast", "southeast", "east", "west", "west", "east", "southwest"],
	TOWN2 : ["west", "west", "east", "northeast", "north", "south", "southeast", "west", "east", "east", "west", "southwest", "south", "north", "northwest"],
}

var internalEnvironmentSegments = {
    "3x3Connected" : ["north", "east", "southwest", "northeast", "south", "west", "east", "south",
					  "northwest", "southeast", "west", "north", "south", "west", "northeast", "southwest",
					  "north", "east", "west", "north", "southeast", "northwest", "east",
					  "southeast", "southwest", "northwest", "northeast"],
}

/*
 * http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
 */
var keyboardKeys = {
		NUMPAD_0 : 96,
		NUMPAD_1 : 97,
		NUMPAD_2 : 98,
		NUMPAD_3 : 99,
		NUMPAD_4 : 100,
		NUMPAD_5 : 101,
		NUMPAD_6 : 102,
		NUMPAD_7 : 103,
		NUMPAD_8 : 104,
		NUMPAD_9 : 105,
		NUMPAD_MULTIPLY : 106,
		NUMPAD_ADD : 107,
		NUMPAD_SUBTRACT : 109,
		NUMPAD_DECIMAL_POINT : 110,
		NUMPAD_DIVIDE : 111,
}

//////////////////////////////////////////////////////////////////////////////
// DEBUG
//////////////////////////////////////////////////////////////////////////////

var sec = 0;
var DEBUG = true;