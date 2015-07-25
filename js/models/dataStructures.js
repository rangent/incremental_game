/*
 * Similar to states, except these are defined here and built at run time (do not maintain state though)
 */

var categoryTree = {};

var cy; //Cytoscape js


/*******************************************************
 * Internal Environment Graph sections
 *******************************************************/
//nice and simple stitchable paths
var internalEnvironmentConstants = {
    TOWN1 : ["north", "south", "west", "north","northeast", "southeast", "east", "west", "west", "east", "southwest"],
	TOWN2 : ["west", "west", "east", "northeast", "north", "south", "southeast", "west", "east", "east", "west", "southwest", "south", "north", "northwest"],
}

var segmentGroups = [
    //general groups describing "form":
    "ORIGIN", /* Start using these when building an IE */
	"JOINER", /* Multiple bind points in multiple directions, good for "gluing" several parts together */
	"N_S", /* north/south */
	"ROUND",
    
    //Sizes:
    "SMALL",
    "MEDIUM",
    "LARGE",
    "HUGE",
		
    //Internal environment groups (which IE are these segments useful for?):
    "ALL", //available for all segment groupings
	"CAVE",
]

//more complicated "segments"
//function Segment(directions, groups, name)
var internalEnvironmentSegments = {
    //BE TODO: CONVERT THIS TO A SEGMENT
    "3x3Connected" : ["north", "east", "southwest", "northeast", "south", "west", "east", "south",
					  "northwest", "southeast", "west", "north", "south", "west", "northeast", "southwest",
					  "north", "east", "west", "north", "southeast", "northwest", "east",
					  "southeast", "southwest", "northwest", "northeast"],
    N_S_SHORT01 : new Segment(
        [new SegmentBindPointNode(null,[new BindPoint("north")]), "south", new SegmentBindPointNode("south",[new BindPoint("south",2)])],
        ["JOINER", "N_S", "SMALL", "ALL"],
        "N_S_SHORT01"
        ),
    
	WINDING_PATH : new Segment(
		[new SegmentBindPointNode(null,[new BindPoint("east")]), "west", new SegmentBindPointNode("northwest",[new BindPoint("north",2)]), "southwest", "west", "northwest", "southwest", "west",
				new SegmentBindPointNode("southwest",[new BindPoint("south",2)]), new SegmentBindPointNode("north",[new BindPoint("west")]), new SegmentBindPointNode("north",[new BindPoint("north",2)]), "southeast"],
		["ORIGIN","JOINER","CAVE", "LARGE"],
		"WINDING_PATH"
		),
	
	OVAL01 : new Segment(
		[new SegmentBindPointNode(null, [new BindPoint("south")]), "northwest", "north", "north", new SegmentBindPointNode("northeast", [new BindPoint("north")]), "south", "southeast", "south", "southwest"],
		["ROUND","CAVE","N_S","MEDIUM"],
		"OVAL01"
		),
}