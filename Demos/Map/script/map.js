define("map", ["expose", "mapTouchController", "locate", "tileCache"], function(expose, _controller, _locate, _tileCache){
	
	var PATTERN_WIDTH = 128,
		TILE_WIDTH = 256,
		_canvas,
		_ctx,
		_dragCanvas,
		_dragCtx,
		_dragPattern,
		_location = {lat:0, lon:0, zoom:0},
		_position = {tileX:0, tileY:0, tileZ:14, offsetX:0, offsetY:0, offsetZ:1},
		_drag = {centerX:0, centerY:0, moveX:0, moveY:0, scale:1},
		_listener = {};
	
	function init(canvas){
		_canvas = canvas;
		_ctx = canvas.getContext("2d");
		_controller.init(_listener, canvas);
		_dragCanvas = document.createElement("canvas");
		_dragCtx = _dragCanvas.getContext("2d");
		_dragPattern = makePattern(_dragCtx);
		
		
		window.addEventListener("resize", onResize, false);
		onResize();
	}
	
	function makePattern(ctx){
		var w = PATTERN_WIDTH;
		ctx.canvas.width = ctx.canvas.height = w;
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, w);
		ctx.fillStyle = "#CCC";
		ctx.fillRect(0, 0, w/2, w/2);
		ctx.fillRect(w/2, w/2, w/2, w/2);
		return _ctx.createPattern(ctx.canvas, "repeat");
	}
	
	function onResize(){
		_canvas.style.width = window.innerWidth + "px";
		_canvas.style.height = window.innerHeight+"px";
		_canvas.width = _canvas.clientWidth;
		_canvas.height = _canvas.clientHeight;
		_dragCanvas.width = _canvas.width;
		_dragCanvas.height = _canvas.height;
		if(_location.zoom == 0){
			dragDraw();
		}else{
			redraw();
		}
	}
	
	function redraw(){
		var w = Math.ceil(_canvas.width/TILE_WIDTH/_position.offsetZ/2);
		var h = Math.ceil(_canvas.height/TILE_WIDTH/_position.offsetZ/2);
		var startX = _position.tileX - w;
		var startY = _position.tileY - h;
		var ctx = _dragCtx;
		ctx.drawImage(_canvas, 0, 0);
		for(var x=0; x<w*2+1 ; x++){
			for(var y=0; y<h*2+1 ; y++){
				var img = _tileCache.getTile(x + startX, y + startY, _position.tileZ);
				img.onload = makeOnLoad(x + startX, y + startY, _position.tileZ, img, ctx);
				
			}
		}
	}
	function makeOnLoad(x, y, z, img, ctx){
		return function(){
			if(z === _position.tileZ){
				var posX = x*TILE_WIDTH - _position.offsetX - _position.tileX*TILE_WIDTH + _canvas.width/2/_position.offsetZ;
				var posY = y*TILE_WIDTH - _position.offsetY - _position.tileY*TILE_WIDTH + _canvas.height/2/_position.offsetZ;
				//var posX = x*TILE_WIDTH - _position.tileX*TILE_WIDTH + _canvas.width/2/_position.offsetZ;
				//var posY = y*TILE_WIDTH - _position.tileY*TILE_WIDTH + _canvas.height/2/_position.offsetZ;
				ctx.drawImage(img, Math.floor(posX*_position.offsetZ), Math.floor(posY*_position.offsetZ), Math.ceil(TILE_WIDTH*_position.offsetZ), Math.ceil(TILE_WIDTH*_position.offsetZ)); 
				//drawCross(ctx.canvas.width/2, ctx.canvas.height/2, ctx, "red");
				//ctx.strokeRect(Math.floor(posX*_position.offsetZ), Math.floor(posY*_position.offsetZ), Math.ceil(TILE_WIDTH*_position.offsetZ), Math.ceil(TILE_WIDTH*_position.offsetZ));
				dragDraw();
			}
		};
	}
	
	function dragDraw(){
		var x = _drag.moveX + _drag.centerX;
		var y = _drag.moveY + _drag.centerY;
		_ctx.save();
		_ctx.translate(x, y);
		_ctx.scale(_drag.scale, _drag.scale);
		_ctx.fillStyle = _dragPattern;
		_ctx.translate(-_drag.centerX, -_drag.centerY);
		_ctx.fillRect(-x/_drag.scale + _drag.centerX, -y/_drag.scale + _drag.centerY, (_canvas.width)/_drag.scale, (_canvas.height)/_drag.scale);
		_ctx.drawImage(_dragCanvas, 0, 0);
		_ctx.restore();
		//drawCross(_ctx.canvas.width/2, _ctx.canvas.height/2, _ctx, "black");
		//drawCross(_drag.centerX, _drag.centerY, _ctx, "blue");
		//drawCross(_drag.centerX + _drag.moveX, _drag.centerY + _drag.moveY, _ctx, "yellow");
		_ctx.stroke();
	}
	
	function drawCross(x, y, ctx, color){
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.moveTo(x + 10, y);
		ctx.lineTo(x - 10, y);
		ctx.moveTo(x, y + 10);
		ctx.lineTo(x, y - 10);
		ctx.stroke();
	}
	
	function setLatLon(lat, lon){
		_location.lon = lon;
		_location.lat = lat;
	}
	function setZoom(zoom, scale){
		scale = scale || 1;
		var t = zoom;
		var x = _locate.long2posX(_location.lon, t);
		var y = _locate.lat2posY(_location.lat, t);
		_position.tileX = Math.floor(x);
		_position.tileY = Math.floor(y);
		_position.tileZ = t;
		_position.offsetX = (x - _position.tileX)*TILE_WIDTH;
		_position.offsetY = (y - _position.tileY)*TILE_WIDTH;
		_position.offsetZ = scale;
		
	}
	
	_listener.moveStart = function(x, y){
		_drag.centerX = x;
		_drag.centerY = y;
		_drag.scale = 1;
	}
	
	
	_listener.moveBy = function(x, y, scale){
		if(scale > 0.125){
			_drag.moveX = x;
			_drag.moveY = y;
			_drag.scale = scale;
			dragDraw();
		}
	}
	
	function combineZoom(integer, scale){
		if(scale >= 1){
			return integer + scale - 1;
		}else{
			return integer + (scale - 1)*2;
		}
	}
	
	_listener.moveEnd = function(){
		//var zoom = Math.log(_position.offsetZ)/Math.log(2)+_position.tileZ;
		var x = (_drag.centerX - _canvas.width/2)*(1 - _drag.scale) + _drag.moveX;
		var y = (_drag.centerY - _canvas.height/2)*(1 - _drag.scale) + _drag.moveY;
		
		if(_drag.scale <=0.5){
			_drag.scale *= 2;
			_position.tileZ--;
		}
		if(_drag.scale >=2){
			_drag.scale /= 2;
			_position.tileZ++;
		}
		_position.tileZ = _locate.limitZoom(_position.tileZ);
		var zoom = combineZoom(_position.tileZ, _position.offsetZ);
		var latMove = _locate.dy2lat(y/TILE_WIDTH, zoom);
		var lonMove = _locate.dx2lon(x/TILE_WIDTH, zoom);
		
		//zoom += Math.log(_drag.scale)/Math.log(2);
		
		setLatLon(_location.lat - latMove,
				  _location.lon - lonMove);
		setZoom(_position.tileZ, _position.offsetZ*_drag.scale);
		_drag.moveX = 0; 
		_drag.moveY = 0;
		_drag.scale = 1;
		redraw();
	};
	
	return expose(
		init,
		setLatLon,
		setZoom,
		redraw
	);
});