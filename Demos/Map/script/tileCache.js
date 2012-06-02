define("tileCache", ["expose"], function(expose){
	
	var MAX_CACHED_TILES = 50,
		_tileCache = {},
		_tileList = [];
	
	function getTile(x, y, zoom){
		var url = getUrl(zoom, x, y);
		if(url in _tileCache){
			return _tileCache[url];
		}else{
			var tile = new Image();
			tile.src = url;
			if(_tileList.length > MAX_CACHED_TILES){
				delete _tileCache[_tileList.shift()];
				_tileCache[url] = tile;
				_tileList.push(url)
			}
			return tile;
		}
	}
	
	function getUrl(z, x, y){
		var url = "http://";
		url += ["a", "b", "c"][Math.floor(Math.random()*3)];
		//url += ".tile.opencyclemap.org/cycle/";
		url += ".tile2.opencyclemap.org/transport/";
		url += z;
		url += "/";
		url += x;
		url += "/";
		url += y;
		url += ".png";
		return url;
	}
	
	return expose(
		getTile
	);
});