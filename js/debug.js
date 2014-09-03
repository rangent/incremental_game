function ftest1() {
	var time = 0;
	for (var i = 0; i < 10; i++) {
		sleep((DEBUG) ? time += 100 : time += 100,testDoExplore);
	}
	sleep((DEBUG) ? time += 1000 : time += 1000, testDoForage);

}

function testDoExplore() {
	$("#doExplore").click();
}

function testDoForage() {
	$("#doForage").click();
}