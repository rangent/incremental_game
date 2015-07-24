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

function getDirectionFromRelativeLocation(location) {
	if (location.x == -1 && location.y == -1) {
		return "northwest";
	} else if (location.x == 0 && location.y == -1) {
		return "north";
	} else if (location.x == 1 && location.y == -1) {
		return "northeast";
	} else if (location.x == -1 && location.y == 0) {
		return "west";
	} else if (location.x == 0 && location.y == 0) {
		return "out";
	} else if (location.x == 1 && location.y == 0) {
		return "east";
	} else if (location.x == -1 && location.y == 1) {
		return "southwest";
	} else if (location.x == 0 && location.y == 1) {
		return "south";
	} else if (location.x == 1 && location.y == 1) {
		return "southeast";
	} else {
		throw "Unhandled direction";
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

function isArray(obj) {
	return typeof directions !== "object" || Object.prototype.toString.call( directions ) !== "[object Array]";
}