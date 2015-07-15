/**
 * static functions, cannot rely on state or other functions!
 */

/**
 * @param {String} direction : cardinal direction
 * @returns {String} opposing cardinal direction, null if direction not recognized
 */
function getOpposingDirection(direction) {
	switch (direction) {
		case "northwest" : return "southeast";
		case "north" : return "south";
		case "northeast" : return "southwest";
		case "east" : return "west";
		case "southeast" : return "northwest";
		case "south" : return "north";
		case "southwest" : return "northeast";
		case "west" : return "east";
		default:
			return null;
	}
}

/**
 * Get the bootstrap "sizes"
 */
function getWindowSize() {
    var w = $(window).width();
    if (w >= 1200) {
        return 'lg';
    } else if (w >= 980) {
        return 'md';
    } else if (w >= 768) {
        return 'sm';
    } else {
        return 'xs';
    }
}