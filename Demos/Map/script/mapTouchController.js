define("mapTouchController", ["expose", "touch"], function(expose, _touch){
	var _map,
		_start = {centerX:0, centerY:0, radius:0},
		_drag = {x:0, y:0, radius:0};
	
	function init(map, canvas){
		_map = map;
		_touch.startTouching(canvas, onTouchStart, onTouchMove, onTouchEnd);
	}
	
	function onTouchStart(touches){
		var avgPos = getAvgPos(touches);
		_start.centerX = avgPos.centerX - _drag.x;
		_start.centerY = avgPos.centerY - _drag.y;
		_start.radius = avgPos.radius;
		_drag.x = 0;
		_drag.y = 0;
		_map.moveStart(_start.centerX, _start.centerY);
	}
	function onTouchMove(touches){
		var avgPos = getAvgPos(touches);
		_drag.x = avgPos.centerX - _start.centerX;
		_drag.y = avgPos.centerY - _start.centerY;
		_map.moveBy(_drag.x, _drag.y, avgPos.radius/_start.radius);
	}
	function onTouchEnd(touches){
		if(touches.length == 0){
			_map.moveEnd();
		}else{
			var avgPos = getAvgPos(touches);
			_start.centerX = avgPos.centerX - _drag.x;
			_start.centerY = avgPos.centerY - _drag.y;
		}
		_drag.x = 0;
		_drag.y = 0;
	}
	
	function getTouchVector(touches){
		
		
		var touch0 = touches[0].id < touches[1].id ? touches[0] : touches[1];
		var touch1 = touches[0].id < touches[1].id ? touches[1] : touches[0];
		
		var vector = {x:touch0.x - touch1.x,
					  y:touch0.y - touch1.y};
		vector.length = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
		vector.centerX = touch1.x + vector.x/2;
		vector.centerY = touch1.y + vector.y/2;
		return vector;
	}
	
	function getAvgPos(touches){
		var centerX = 0;
		var centerY = 0;
		var radius = 0;
		var count = 0;
		touches.forEach(function(e,i,c){
			count++;
			centerX += e.x;
			centerY += e.y;
		});
		var dist = 0;
		centerX /= count;
		centerY /= count;
		touches.forEach(function(e,i,c){
			var dx = centerX - e.x;
			var dy = centerY - e.y;
			radius += Math.sqrt(dx*dx + dy*dy);
		});
		radius = radius/count || 1;
		return {centerX:centerX, centerY:centerY, radius:radius};
	}
	
	return expose(
		init
	);

});