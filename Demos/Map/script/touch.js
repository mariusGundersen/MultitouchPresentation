define("mousetouch", ["expose"], function(expose){

	var _target,
		_onStart,
		_onMove,
		_onEnd
		_mouseIsDown = false;

	function startTouching(target, onStart, onMove, onEnd){
		_target = target;
		_onStart = onStart;
		_onMove = onMove;
		_onEnd = onEnd;
		target.addEventListener("mousedown", onTouchStart, false);
		target.addEventListener("mousemove", onTouchMove, false);
		target.addEventListener("mouseup", onTouchEnd, false);
		target.addEventListener("mousewheel", onScroll, false);
	}
	function stopTouching(target){
		target.removeEventListener("mousedown", onTouchStart);
		target.removeEventListener("mousemove", onTouchMove);
		target.removeEventListener("mouseup", onTouchEnd);
		target.removeEventListener("mousewheel", onScroll);
	}
	
	function onScroll(e){
		if(_mouseIsDown == false){
			_onStart(getLocalTouches(e, 2, 10));
			var a = 0.75;
			var b = 1.5;
			var d = (e.wheelDelta/Math.abs(e.wheelDelta))*(b-a)/2 + (a+b)/2;
			_onMove(getLocalTouches(e, 2, 10*d));
			_onEnd([]);
			e.preventDefault();
			return false;
		}
	}
	
	function onTouchStart(e){
		_mouseIsDown = true;
		_onStart(getLocalTouches(e));
		e.preventDefault();
		return false;
	}
	function onTouchMove(e){
		if(_mouseIsDown){
			_onMove(getLocalTouches(e));
			e.preventDefault();
			return false;
		}
	}
	function onTouchEnd(e){
		_mouseIsDown = false;
		_onEnd([]);
		e.preventDefault();
		return false;
	}
	
	function getLocalTouches(globalTouches, touches, scale){
		touches = touches || 1;
		scale = scale || 10;
		var localTouches = [];
		var e = globalTouches;
		for(var i=0; i<touches; i++){
			var touch = unScalePoint(unOffsetPoint(e.pageX - scale*((touches - 1)/2 - i), e.pageY, e.target), 1);
			touch.id = i+1;
			localTouches.push(touch);
		}
		return localTouches;
	}

	function unScalePoint(point, scale){
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
	
	return expose(
		startTouching,
		stopTouching
	);
});

define("touch", ["expose"], function(expose){

	var _target,
		_onStart,
		_onMove,
		_onEnd;

	function startTouching(target, onStart, onMove, onEnd){
		_target = target;
		_onStart = onStart;
		_onMove = onMove;
		_onEnd = onEnd;
		target.addEventListener("touchstart", onTouchStart, false);
		target.addEventListener("touchmove", onTouchMove, false);
		target.addEventListener("touchend", onTouchEnd, false);
	}
	function stopTouching(target){
		target.removeEventListener("touchstart", onTouchStart);
		target.removeEventListener("touchmove", onTouchMove);
		target.removeEventListener("touchend", onTouchEnd);
	}
	
	function onTouchStart(e){
		_onStart(getLocalTouches(e.targetTouches));
		e.preventDefault();
		return false;
	}
	function onTouchMove(e){
		_onMove(getLocalTouches(e.targetTouches));
		e.preventDefault();
		return false;
	}
	function onTouchEnd(e){
		_onEnd(getLocalTouches(e.targetTouches));
		e.preventDefault();
		return false;
	}
	
	function getLocalTouches(globalTouches){
		var localTouches = [];
		forEachTouch(globalTouches, function(e, i, c){
			var touch = unScalePoint(unOffsetPoint(e.pageX, e.pageY, e.target), 1);
			touch.id = e.identifier;
			localTouches.push(touch);
		});
		localTouches.sort(function(a, b){
			return a.identifier - b.identifier;
		});
		return localTouches;
	}
	
	function forEachTouch(touches, callback){
		for(var i=0; i<touches.length; i++){
			callback(touches[i], i, touches);
		}
	}

	function unScalePoint(point, scale){
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
	
	return expose(
		startTouching,
		stopTouching
	);
});