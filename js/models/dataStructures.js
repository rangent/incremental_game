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

//more complicated "segments"
//function Segment(directions, groups, name)
var internalEnvironmentSegments = {
    //BE TODO: CONVERT THIS TO A SEGMENT
    "3x3Connected" : ["north", "east", "southwest", "northeast", "south", "west", "east", "south",
					  "northwest", "southeast", "west", "north", "south", "west", "northeast", "southwest",
					  "north", "east", "west", "north", "southeast", "northwest", "east",
					  "southeast", "southwest", "northwest", "northeast"],
	WINDING_PATH : new Segment(
		[new SegmentBindPointNode(null,[new BindPoint("east")]), "west", new SegmentBindPointNode("northwest",[new BindPoint("north",2)]), "southwest", "west", "northwest", "southwest", "west",
				new SegmentBindPointNode("southwest",[new BindPoint("south",2)]), new SegmentBindPointNode("north",[new BindPoint("west")]), new SegmentBindPointNode("north",[new BindPoint("north",2)]), "southeast"],
		["ORIGIN","JOINER","CAVE"],
		"WINDING_PATH"
		),
	
	OVAL01 : new Segment(
		[new SegmentBindPointNode(null, [new BindPoint("south")]), "northwest", "north", "north", new SegmentBindPointNode("northeast", [new BindPoint("north")]), "south", "southeast", "south", "southwest"],
		["ROUND","CAVE","N_S"],
		"OVAL01"
		),
}