define("game", ["expose",
				"animate",
				"draw",
				"input",
				"blob"], function(expose,
								  _animate,
								  _draw,
								  _input,
								  Blob){

	var _main,
		_canvas,
		_ctx,
		_score = 0,
		_blobs = [],
		_baskets = [],
		_startTime = 0,
		_isGameOver = false,
		_deltaTime = 15000,
		_colors = ["red", "green", "blue", "orange"],
		_inputListener = {},
		_scale = 1,
		_rotation = 0;
		
	function init(main){
		_main = main;
		_canvas = document.getElementById("canvas");
		_ctx = _canvas.getContext("2d");
		_draw.init(_colors);
	};

	function startNewGame(){
		_score = 0;
		_blobs = [];
		_baskets = [];
		_startTime = +new Date();
		_isGameOver = false;
		_currentTime = 0;
		_nextBlobTime = 1000;
		_deltaTime = 15000;

		for(var i=0; i<_colors.length; i++){
			_baskets.push({
				color: _colors[i],
				x: i/_colors.length,
				y: 0,
				height: 0.05,
				width: 1/_colors.length
			});
		}
		
		
		
		setTimeout(scrollTo, 0, 0, 1);
		_animate.start(onEnterFrame);
		onOrientationChanged();

		window.addEventListener("orientationchange", onOrientationChanged, false);
		window.addEventListener("resize", onOrientationChanged, false);
		_input.startInput(_inputListener, _canvas);
	};

	function endGame(){
		_animate.stop();

		window.removeEventListener("orientationchange", onOrientationChanged);
		window.removeEventListener("resize", onOrientationChanged);
		
		_input.stopInput(_inputListener, _canvas);
		
		
		_main.onGameEnded();
		_isGameOver = true;
	};

	function onOrientationChanged(e){
		_canvas.style.width = window.innerWidth + "px";
		_canvas.style.height = window.innerHeight + "px";
		_canvas.width = _canvas.clientWidth*_scale;
		_canvas.height = _canvas.clientHeight*_scale;
		
		
	};

	function makeBlob(){
		
		var colorIndex = Math.floor(Math.random()*_colors.length);
		var color = _colors[colorIndex];

		var blob = new Blob(color, _canvas, colorIndex);
		blob.width = 20+Math.random()*_score;
		blob.speed = 1/(120 - blob.width);
		blob.x = Math.random()*(_canvas.width - blob.width*2) + blob.width;
		
		return blob;
	}

	function onEnterFrame(dt){
		_currentTime += dt;
		_draw.initFrame(_ctx);

		for(var i in _baskets){
			_draw.drawBasket(_baskets[i], _ctx);
		}
		
		if(_currentTime > _nextBlobTime){
			_blobs.push(makeBlob());
			_nextBlobTime = _currentTime + _deltaTime;
			_deltaTime = 5000 + (_deltaTime-5000)*0.9;
		}
		var goodBlobs = [];
		for(var i = 0; i < _blobs.length; i++){
			var blob = _blobs[i];
			
			blob.update(dt);
			for( var j = i+1; j < _blobs.length; j++){
				if(blob.collidesWith(_blobs[j])){
					endGame();
				}
			}
			
			if(blob.isLost){
				endGame();
			}else if(blob.isInsideRect(_baskets[blob.colorIndex])){
				_score ++;
			}else{
				goodBlobs.push(blob);
			}
			_draw.drawPath(blob, blob.path, _ctx);
			_draw.drawBlob(blob, _ctx);
		}
		_blobs = goodBlobs;
		
		_draw.drawScore(_score, _ctx);
		
		
		if(_isGameOver){
			_draw.drawGameOver(_score, _ctx);
		}
		
		
	};
	
	_inputListener.findBlobAt = function(x, y){
		for(var i in _blobs){
			var blob = _blobs[i];
			if(blob.isMouseOver(x, y)){
				return blob;
			}
		}
		return false;
	};
	

	
	return expose(  {
						get scale(){
							return _scale;
						},
						get score(){
							return _score;
						}
					},
					init,
					startNewGame);

});


define("blob", [], function(){
	function Blob(color, canvas, colorIndex){
		this.color = color;
		this.colorIndex = colorIndex;
		this.width = 20;
		this.x = 0;
		this.y = canvas.height + this.width;
		this.dir = Math.PI*1.5;
		this.speed = 1/100;
		this.path = [];
		this.isLost = false;
		this.hasBeenInside = false;
		this.stageRect = {x:0, y:0, width:1, height:1};
		this.canvas = canvas;
		this.mouse = {prevX:0, prevY:0};
	};

	Blob.prototype.update = function(dt){
		
		if(this.path.length > 0){
			var dx = this.path[0].x - this.x;
			var dy = this.path[0].y - this.y;
			this.dir = Math.atan2(this.path[0].y - this.y, this.path[0].x - this.x);	
			if( (dx*dx + dy*dy) < this.width){
				this.path.shift();
			}
		
		}
		this.x += Math.cos(this.dir)*this.speed*dt;
		this.y += Math.sin(this.dir)*this.speed*dt;
		
		if(this.isInsideRect(this.stageRect)){
			this.hasBeenInside = true;
		}else{
			if(this.hasBeenInside){
				this.isLost = true;
			}
		}
	}

	Blob.prototype.isMouseOver = function(x, y){
		var dx = x - this.x;
		var dy = y - this.y;
		return (dx*dx + dy*dy) < this.width*this.width;
	}
	Blob.prototype.startPath = function(x, y){
		this.mouse.prevX = x;
		this.mouse.prevY = y;
		this.path = [];
	}
	Blob.prototype.movePath = function(x, y){
		var dx = x - this.mouse.prevX;
		var dy = y - this.mouse.prevY;
		
		if(dx*dx + dy*dy > 100){

			this.path.push({x:x, y:y});

			this.mouse.prevX = x;
			this.mouse.prevY = y;
		}
	}

	Blob.prototype.collidesWith = function(blob){
		var dx = blob.x - this.x;
		var dy = blob.y - this.y;
		return Math.sqrt(dx*dx + dy*dy) < this.width/2 + blob.width/2;
	}

	Blob.prototype.isInsideRect = function(rect){
		return  (this.x > rect.x*this.canvas.width) && 
				(this.x < rect.x*this.canvas.width + rect.width*this.canvas.width) && 
				(this.y > rect.y*this.canvas.height) && 
				(this.y < rect.y*this.canvas.height + rect.height*this.canvas.height);
	}
	return Blob;
});