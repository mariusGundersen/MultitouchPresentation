define("expose", ["toType"], function(toType){
	return function(){
		var list = arguments;
		var func = /^function\s+([^(]+)/i;
		var i=0;
		var obj;
		if(toType(list[0]) == "object"){
			obj = list[0];
			i++;
		}else{
			obj = {};
		}
		for(; i<list.length; i++){
			obj[func.exec(list[i].toString())[1]] = list[i];
		}
		return obj;
	}
});

define("toType", [], function() {
	return function(obj){
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
	}
});
