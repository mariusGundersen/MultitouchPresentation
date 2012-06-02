
function Point(x, y, ensure){
	this.x = x;
	this.y = y;
	this.ensure = ensure;
	this.touched = false;
}
Point.prototype.draw = function(ctx){
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
	ctx.arc(this.x, this.y, 10, 0, Math.PI*2, false);
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

Point.prototype.near = function(x, y){
	var dx = x - this.x;
	var dy = y - this.y;
	return (dx*dx + dy*dy) < 30*30;
}
Point.prototype.isTouchedBy = function(touch){
	return this.touched === touch.identifier;
}
Point.prototype.setTouch = function(touch){
	this.touched = touch.identifier;
}
Point.prototype.clearTouch = function(){
	this.touched = false;
}
Point.prototype.setPos = function(x, y){
	var p = this.ensure(x, y);
	this.x = p.x;
	this.y = p.y;
}