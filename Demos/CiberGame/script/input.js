define("input", ["expose"], function(expose){

	var _listener,
		_mouse = {isDown:false, selected:false},
		_touches = {},
		_source;

	function startInput(listener, source){
		_listener = listener;
		_source = source;
		source.addEventListener("mousedown", onMouseDown, false);
		source.addEventListener("mousemove", onMouseMove, false);
		window.addEventListener("mouseup", onMouseUp, false);
		source.addEventListener("touchstart", onTouchStart, false);
		source.addEventListener("touchmove", onTouchMove, false);
		source.addEventListener("touchend", onTouchEnd, false);
		_mouse.isDown = false;
		_mouse.selected = false;
	}
	
	function stopInput(listener, source){
		source.removeEventListener("mousedown", onMouseDown);
		source.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);	
		source.removeEventListener("touchstart", onTouchStart);
		source.removeEventListener("touchmove", onTouchMove);
		source.removeEventListener("touchend", onTouchEnd);
	}

	function onMouseDown(e){
		var point = transformPoint(unOffsetPoint(e.pageX, e.pageY, e.target), _source.width/_source.clientWidth, 0);
		var blob = _listener.findBlobAt(point.x, point.y);
		if(blob){
			_mouse.selected = blob;
			blob.startPath(point.x, point.y);
			_mouse.isDown = true;
		}
		
		e.stopPropagation();
		e.preventDefault();
		return false;
	};


	function onMouseMove(e){
		var point = transformPoint(unOffsetPoint(e.pageX, e.pageY, e.target), _source.width/_source.clientWidth, 0);
		if(_mouse.isDown){
			_mouse.selected.movePath(point.x, point.y);
		}
		e.stopPropagation();
		e.preventDefault();
		return false;

	};
	function onMouseUp(e){
		
		_mouse.isDown = false;
		
		e.stopPropagation();
		e.preventDefault();
		return false;
	};

	function onTouchStart(e){
		for(var i=0; i<e.changedTouches.length; i++){
			var touch = e.changedTouches[i];
			var point = transformPoint(unOffsetPoint(touch.pageX, touch.pageY, touch.target), _source.width/_source.clientWidth, 0);
			var blob = _listener.findBlobAt(point.x, point.y);
			if(blob){
				_touches["t"+touch.identifier] = blob;
				blob.startPath(point.x, point.y);
			}
		}
		e.stopPropagation();
		e.preventDefault();
		return false;
	};


	function onTouchMove(e){
		for(var i=0; i<e.changedTouches.length; i++){
			var touch = e.changedTouches[i];
			var point = transformPoint(unOffsetPoint(touch.pageX, touch.pageY, touch.target), _source.width/_source.clientWidth, 0);
			if(("t"+touch.identifier) in _touches){
				_touches["t"+touch.identifier].movePath(point.x, point.y);
			}
		}
		e.stopPropagation();
		e.preventDefault();
		return false;

	};
	
	function onTouchEnd(e){
		for(var i=0; i<e.changedTouches.length; i++){
			var touch = e.changedTouches[i];
			if(("t"+touch.identifier) in _touches){
				delete _touches["t"+touch.identifier];
			}
		}
		
		e.stopPropagation();
		e.preventDefault();
		return false;
	};
	
	function transformPoint(point, scale, rotation){
		return {x: point.x*scale,
				y: point.y*scale};
	}

	function unOffsetPoint(x, y, elm){
		if(elm.offsetParent){
			var u = unOffsetPoint(x, y, elm.offsetParent);
			return {x:u.x - elm.offsetLeft, 
					y:u.y - elm.offsetTop};
		}else{
			return {x:x - elm.offsetLeft, 
					y:y - elm.offsetTop};
		}
	}
	
	function unOffsetTouches(touches){
		
		for(var i=0; i<touches.length; i++){
			var pos = unOffsetPoint(touches[i].pageX, touches[i].pageY, touches[i].target);
			touches[i].localX = pos.x;
			touches[i].localY = pos.y;
		}
		
	};

	return expose(startInput,
				  stopInput);
	
});