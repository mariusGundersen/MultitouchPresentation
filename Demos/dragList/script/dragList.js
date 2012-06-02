define("dragList", ["animate"], 
		   function(_animate){
	var _list; 
	var _dragging = {dragY:0, 
					 dragX:0, 
					 startY:0, 
					 startX:0, 
					 target: false,
					 dragged: true};

	function init(list){
		_list = list;
		_animate.start(doDragItem);
		_animate.pause();
	}
	
	function startEdit(){
		_list.addClass("edit");
		_list.on("touchstart", "img", onTouchStart);
		_list.on("mousedown", "img", onMouseDown);
	}
	
	function stopEdit(){
		_list.removeClass("edit");
		_list.off("touchstart", "img", onTouchStart);
		_list.off("mousedown", "img", onMouseDown);
		_list.off("touchmove", onTouchMove);
		_list.off("touchend", onTouchEnd);
		_list.off("mousemove", onMouseMove);
		_list.off("mouseup", onMouseUp);
		
		var items = [];
		$("li", _list).each(function(){
			items.push({name: $("span", this).text(), value:0});
		});
		
		return items;
	}
	
	function isEditing(){
		var edit = $(".edit");
		return edit.length == 1;
	}
	
	function insert(name, value){
		_list.append($('<li><span>'+name+'</span><input data-name="'+name+'" type="number" value="'+value+'"></input><img src="gfx/drag.png" class="drag"></img><img src="gfx/trash.png" class="delete"></img></li>'));
	}
	
	
	function onMouseDown(e){
		var target = $(this).parent("li");
		var x = e.originalEvent.pageX;
		var y = e.originalEvent.pageY;
		
		onDragStart(target, x, y);
		
		_list.on("mousemove", onMouseMove);
		_list.on("mouseup", onMouseUp);
		
		e.preventDefault();
		return false;
	}
	function onMouseMove(e){
		var x = e.originalEvent.pageX;
		var y = e.originalEvent.pageY;
		
		onDragMove(x, y);
		
		e.preventDefault();
		return false;
	}
	function onMouseUp(e){
		var x = e.originalEvent.pageX;
		
		onDragEnd(x, 0);
		
		_list.off("mousemove", onMouseMove);
		_list.off("mouseup", onMouseUp);
		
		
		e.preventDefault();
		return false;
	}
	
	function onTouchStart(e){
		var target = $(this).parent("li");
		var x = e.originalEvent.changedTouches[0].pageX;
		var y = e.originalEvent.changedTouches[0].pageY;
		
		onDragStart(target, x, y);
		
		_list.on("touchmove", onTouchMove);
		_list.on("touchend", onTouchEnd);
		
		e.preventDefault();
		return false;
	}
	function onTouchMove(e){
		var x = e.originalEvent.changedTouches[0].pageX;
		var y = e.originalEvent.changedTouches[0].pageY;
		
		onDragMove(x, y);
		
		e.preventDefault();
		return false;
	}
	function onTouchEnd(e){
		var x = e.originalEvent.changedTouches[0].pageX;
		
		onDragEnd(x, 0);
		
		_list.off("touchmove", onTouchMove);
		_list.off("touchend", onTouchEnd);
		
		
		e.preventDefault();
		return false;
	}
	
	function onDragStart(target, x, y){
		_dragging.target = target;
		_dragging.target.addClass("dragging");
		_dragging.startX = x;
		_dragging.startY = y;
		_dragging.dragX = 0;
		_dragging.dragY = 0;
		setTransformOnElement("scale(1, 1.1)", _dragging.target);
		_animate.unpause();
	}
	function onDragMove(x, y){
		var dx = x - _dragging.startX;
		var dy = y - _dragging.startY;
		
		dx = dx > 0 ? 0 : dx;
		
		_dragging.dragX = dx;
		_dragging.dragY = dy;
		
		_dragging.hasDragged = false;
		
	}
	function doDragItem(tick){
		if(_dragging.target === false || _dragging.hasDragged === true) return;
		
		
		
		var dx = _dragging.dragX;
		var dy = _dragging.dragY;
		
		
		var inside = true;
		var height = _dragging.target.outerHeight();
		var width = _dragging.target.outerWidth();
		if(dx < -width/2){
			dy = 0;
		}else{
			dx = 0;
			if(dy > 0){
				if(_dragging.target.next().length == 0){
					inside = false;
				}else{
					var nextElm = _dragging.target;
					while(dy > height){
						console.log("skip", dy, height);
						nextElm = nextElm.next();
						_dragging.startY += height;
						dy -= height;
					}
					if(nextElm[0] != _dragging.target[0]){
						_dragging.target.insertAfter(nextElm);
					}
				}
			}else if(dy < 0){
				if(_dragging.target.prev().length == 0){
					inside = false;
				}else{
					var prevElm = _dragging.target;
					while(dy < -height){
						prevElm = prevElm.prev();
						_dragging.startY -= height;
						dy += height;
					}
					if(prevElm[0] != _dragging.target[0]){
						_dragging.target.insertBefore(prevElm);
					}
				}
			}
		}
		if(inside){
			setTransformOnElement("translate("+dx+"px,"+dy+"px) scale(1, 1.1)", _dragging.target);
		}else{
			setTransformOnElement("scale(1, 1.1)", _dragging.target);
		}
		_dragging.hasDragged = true;
	}
	function onDragEnd(x, y){
		var dx = x - _dragging.startX;
		
		var width = _dragging.target.outerWidth();
		if(dx < -width/2){
			_dragging.target.remove();
		}else{
			_dragging.target.removeClass("dragging");
			setTransformOnElement("", _dragging.target);
		}
		_animate.pause();
		_dragging.target = false;
	}
	
	
	function setTransformOnElement(transform, element){
	
		element.css("-webkit-transform", transform);
		element.css("OTransform", transform);
		element.css("MozTransform", transform);
	}
	
	return expose(
		init,
		startEdit,
		stopEdit,
		isEditing,
		insert);
	
});