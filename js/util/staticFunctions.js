/**
 * static functions, cannot rely on state or other functions!
 */

/**
 * @param {String} direction : cardinal direction
 * @returns {String} opposing cardinal direction, return input if direction not recognized
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
			return direction;
	}
}

function get45DegreeRotatedDirection(direction) {
	switch (direction) {
		case "northwest" : return "north";
		case "north" : return "northeast";
		case "northeast" : return "east";
		case "east" : return "southeast";
		case "southeast" : return "south";
		case "south" : return "southwest";
		case "southwest" : return "west";
		case "west" : return "northwest";
		default:
			return direction;
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
 * @param {Object} obj : any object
 * @param {String} type : string of a type
 */
function isType(obj, type) {
	return obj.hasOwnProperty("type") && obj.type === type;
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

function rand(min, max) {
	var rand = Math.random();
	var r = Math.floor( Math.random() * (max - min + 1) + min);
	return r;
}

//from http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}