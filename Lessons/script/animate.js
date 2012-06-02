window.animate = function(callback){

	window.requestAnimFrame = function(){
		return (
			window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();
	
	var play = true;
	var lastAnimFrame = 0;
	var animFrame = function(e){
		e = e || +new Date();
		callback(e-lastAnimFrame); 
		lastAnimFrame = e; 
		if(play){
			window.requestAnimFrame(animFrame); 
		}
	}
	window.requestAnimFrame(animFrame);
	
	function pause(){
		play = false;
	}
	function unpause(){
		play = true;
		window.requestAnimFrame(animFrame);
	}
	return {
		pause: pause,
		unpause: unpause
	}
}