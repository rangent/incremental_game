/*
 *	CORE VIEW FUNCTIONS TO INTITIALIZE AND UPDATE VALUES, SETUP BOARD
 */

//////////////////////////////////////////////////////////////////////////////
// JOYRIDE STUFFS
//////////////////////////////////////////////////////////////////////////////

function letsJoyride(joyrideElementName) {
	$("#joyride" + joyrideElementName).joyride({
		//want to blow away the tip after it completes
		postRideCallback: function(){
			$('.first-joyride-tips').joyride('destroy');
		},
		nextButton : false,
		autoStart : true,
		modal:false,
		expose: false
	  });
}	

function addJoyrideTip(tipConstant) {
	$("#joyrideTips").append(tipConstant);
}

function closeJoyrideTips() {
	$(".joyride-close-tip").click();
}