var FPS = (function(){
	var _fps = 1, 
		_start = +new Date(),
		_count = 0,
		_color = "#000000",
		_span = false;
		
	function init(parent){
		_span = document.createElement("span");
		_span.style.position = "absolute"
		_span.style.top = "0";
		_span.style.left = "0";
		_span.style.zIndex = "10001";
		parent.appendChild(_span);
	}
		
	function frameComplete(ctx){
		var now = +new Date();
		if(now - _start>1000){
			_fps = Math.round(_count/(now - _start)*100000)/100;
			_start = now;
			_count = 0;
			_span.innerHTML = _fps+"fps";
		}
		_count++;
	};

	
	return {init:init,
			frameComplete: frameComplete};
})();