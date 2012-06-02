define("locate", ["expose"], function(expose){
	
	var _zoom;
	
	function getTileUrl(lat, lon, zoom){
		return url(zoom, long2tile(lon, zoom), lat2tile(lat, zoom));
	}
	
	
	function url(z, x, y){
		var url = "http://";
		url += ["a", "b", "c"][Math.round(Math.random()*3)];
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
	
	function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
	function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
	function long2posX(lon,zoom) { return ((lon+180)/360*Math.pow(2,zoom)); }
	function lat2posY(lat,zoom)  { return ((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)); }
	
	function tile2long(x,z) {
		return (x/Math.pow(2,z)*360-180);
	}
	function tile2lat(y,z) {
		var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
		return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	}
	
	
	function dx2lon(x,z) {
		return (x/Math.pow(2,z)*360);
	}
	function dy2lat(y,z) {
		var n = -Math.PI*y/Math.pow(2,z);
		return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	}
	
	function limitZoom(zoom){
		return Math.max(Math.min(zoom, 18), 0);
	}
	
	return expose(	
		{
			get zoom(){
				return _zoom;
			},
			set zoom(zoom){
				_zoom = zoom;
			}
		},
		getTileUrl,
		long2tile,
		lat2tile,
		long2posX,
		lat2posY,
		tile2long,
		tile2lat,
		dx2lon,
		dy2lat,
		limitZoom
	);
});