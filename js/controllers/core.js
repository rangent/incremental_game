/*
 *	Controller for core functions
 */

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

function sleep(millis, callback, arg1) {
    setTimeout(function()
            { callback(arg1); }
    , millis);
}

function sleep(millis, callback, arg1, arg2) {
    setTimeout(function()
            { callback(arg1, arg2); }
    , millis);
}

function sleep(millis, callback, arg1, arg2, arg3) {
    setTimeout(function()
            { callback(arg1, arg2, arg3); }
    , millis);
}

function enableActionForPlayer(playerAction) {
	playerAction.availableToPlayer = true;
}

function disableAction(playerAction) {
    playerAction.actionEnabled = false;    
}