define("draw", ["expose"], function(expose){

	var _images = {};

	function init(colors){
		for(var i in colors){
			var color = colors[i];
			_images[color] = new Image();
			_images[color].src = "gfx/"+color+".png";
		}
	};

	/**
	Clears the entire screen each frame, 
	so content is not drawn on top of previous content
	
	
	*/
	function initFrame(ctx){
		//ctx.canvas.width = ctx.canvas.width;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	};
	
	/**
	Draw one of the baskets at the top of the screen.
	
	Each basket has a color ("red", "yellow", "green", "blue"),
	an (x, y) coordinate and a width and height.
	The x, y, width and height are all ratios of the screen width/height
	Therefore the actual x, y, width, height needs to be multiplied with the current 
	screen width and height.
	
	globalAlpha is used to make the baskets dimmer (on the white background).
	*/
	function drawBasket(basket, ctx){
		
		var x = basket.x * ctx.canvas.width;
		var y = basket.y * ctx.canvas.height;
		var width = basket.width * ctx.canvas.width;
		var height = basket.height * ctx.canvas.height;
		
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = basket.color;
		ctx.fillRect(x, y, width, height);
		ctx.globalAlpha = 1;
	};

	/**
	Draws a single Blob, as it makes it way from the bottom to the top.
	
	The Blob has an (x, y) coordinate, a color, a direction (`dir`) and a width.
	
	We use the images which were preloaded in the init function to draw the blob.
	This function rotates the blob so it points in the direction it is moving. 
	We translate the coordinate system of the canvas to the position of the blob (x, y).
	We then rotate the coordinate system so it points in the same directio as the blob.
	Finally we draw the blob, offsett by half its width and heigh, so it rotates around its center.
	
	*/
	function drawBlob(blob, ctx){
		var x = - blob.width/2;
		var y = - blob.width/2;
		ctx.save();
		ctx.translate(blob.x, blob.y);
		ctx.rotate(blob.dir + Math.PI/2);
		ctx.drawImage(_images[blob.color], x, y, blob.width, blob.width);
		ctx.restore();
	};

	/**
	This function draws the path from a Blob towards the correct bin
	
	The funnction first checks if the path is empty; there is no point in 
	drawing an empty path
	The `strokeStyle` is set using the color of the Blob.
	It then loops through each point in the path array, and `lineTo`'s each one.
	
	Finally it uses `stroke` to draw the line
	*/
	function drawPath(blob, path, ctx){
		if(path.length > 0){			
			ctx.strokeStyle = blob.color;
			ctx.lineWidth = 3;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.beginPath();
			ctx.moveTo(blob.x, blob.y);
			for(var i=0; i<path.length; i++){
				var point = path[i];
				ctx.lineTo(point.x, point.y);
			}
			ctx.stroke();
		}
	};

	
	/**
	This function draws the score as part of the background.
	
	The score is an integer, and is drawn at the center of the screen.
	The score is scaled based on the screen size.
	
	`FillText` is used to draw the score with a grey color (#CCC).
	
	*/
	function drawScore(score, ctx){
		ctx.globalCompositeOperation = "destination-over";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = (150*ctx.canvas.width/ctx.canvas.clientWidth) + "px Helvetica, Arial, Sans-Serif";
		ctx.fillStyle = "#CCC";
		ctx.fillText(score, ctx.canvas.width/2, ctx.canvas.height/2);
		ctx.globalCompositeOperation = "source-over";
	};
	
	/**
	This function draws the GameOver overlay.
	
	It draws a black semi-see through layer with white text.
	
	The text is exactly the same as the score text, only white.
	Below the score is an instruction to touch the screen, which brings 
	the player to the highscore screen.
	*/

	function drawGameOver(score, ctx){
		
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = (150*ctx.canvas.width/ctx.canvas.clientWidth) + "px Helvetica, Arial, Sans-Serif";
		ctx.fillStyle = "#fff";
		ctx.fillText(score, ctx.canvas.width/2, ctx.canvas.height/2);
		ctx.font = "30px Helvetica, Arial, Sans-Serif";
		ctx.fillText("Touch the screen", ctx.canvas.width/2, ctx.canvas.height*3/4);
	};
	
	return expose(init, 
				  initFrame,
				   drawScore,
				   drawBasket,
				   drawBlob,
				   drawPath,
				   drawGameOver);
		   
		   

});