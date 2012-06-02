define("main", ["expose", "map"], function(expose, _map){
	
	function init(){
		_map.init($("#canvas")[0]);
		var location = localStorage.getItem("location");
		if(location){
			location = JSON.parse(location);
			positionFound(location.lat, location.lon, location.zoom);
		}else{
			positionFound(0, 0, 2);
		}
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition( 
		 
				function (position) {  
		 
				// Did we get the position correctly?
				// alert (position.coords.latitude);
		 
				// To see everything available in the position.coords array:
				// for (key in position.coords) {alert(key)}
		 
				positionFound(position.coords.latitude, position.coords.longitude, 14);
		 
				}, 
				// next function is the error callback
				function (error)
				{
					switch(error.code) 
					{
						case error.TIMEOUT:
							alert ('Timeout');
							break;
						case error.POSITION_UNAVAILABLE:
							alert ('Position unavailable');
							break;
						case error.PERMISSION_DENIED:
							alert ('Permission denied');
							break;
						case error.UNKNOWN_ERROR:
							alert ('Unknown error');
							break;
					}
				}
			);
		}
	}

	function positionFound(lat, lon, zoom){
		_map.setLatLon(lat, lon);
		_map.setZoom(zoom);
		_map.redraw();
		//localStorage.setItem("location", JSON.stringify({lat:lat, lon:lon, zoom:zoom}));
	}
	
	$(init);
});