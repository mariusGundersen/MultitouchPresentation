define("backend", ["expose"], function(expose){

	var URL_PREFIX = "highscore.ajax",
		_gui;

	function init(gui){
		_gui = gui;
		window.addEventListener("online", onOnline, false);
	};

	function doGetScores(callback){
		var url = URL_PREFIX+"?";
		var success = function(e, r, s){
			callback(e, r, s);
			cacheData(e, r, s);
		};
		var error = function(){
			onGetError(callback);
		};
		
		requestJSON(url, success, error);
	};

	function doSubmitScore(score, name, callback){
		
		var url = URL_PREFIX + "?"+score+"+"+name;
		var success = function(e,r,s){
			callback(e,r,s);
		};
		var error = function(e, r, s){
			onSubmitError(score, name);
			callback(e, r, s);
		};
		
		requestJSON(url, success, error);
	};

	function requestJSON(url, success, error){
		_gui.synchStarted();
		$.getJSON(url).
			error(function(e,r,s){
				error(e,r,s);
				_gui.synchFailed();
			}).
			success(function(e,r,s){
				success(e,r,s);
				onOnline();
				_gui.synchCompleted();
			});
	};




	function onOnline(){
		var entry = popPendingScore();
		if(entry){
			doSubmitScore(entry.score, entry.name, function(){/*Do nothing*/});
		}
	};

	function cacheData(data){
		setCachedScores(data);
	};

	function onGetError(callback){
		var data = getCachedScores();
		var scores = getPendingScores();
		for(var i=0; i<scores.length; i++){
			insertScore(data.results, scores[i].name, scores[i].score);
		}
		data.results.sort(function(a, b){
			return b.score - a.score;
		});
		data.results = data.results.slice(0, 20);
		callback(data);
	};

	function onSubmitError(score, name){
		pushPendingScore(name, score);
	};

	function insertScore(scores, name, score){
		for(var i=0; i<scores.length; i++){
			if(scores[i].name == name){
				break;
			}
		}
		if(i == scores.length){
			scores.push({name:name, score:score});
		}else{
			if(scores[i].score < score){
				scores[i].score = score;
			}
		}
	};


	/******* OFFLINE MODE ********/

	function pushPendingScore(name, score){
		var scores = JSON.parse(localStorage.getItem("scores") || "[]");
		insertScore(scores, name, score);
		localStorage.setItem("scores", JSON.stringify(scores));
	};

	function popPendingScore(){
		var scores = JSON.parse(localStorage.getItem("scores") || "[]");
		if(scores.length > 0){
			var score = scores.shift();
			localStorage.setItem("scores", JSON.stringify(scores));
			return score;
		}else{
			return false;
		}
	};

	function getPendingScores(){
		return JSON.parse(localStorage.getItem("scores") || "[]");
	};

	function setCachedScores(data){
		localStorage.setItem("cache", JSON.stringify(data));
	};

	function getCachedScores(){
		if(localStorage.getItem("cache")){
			return JSON.parse(localStorage.getItem("cache"));
		}else{
			return {results:[]};
		}
	};
	
	return expose(init,
				  doGetScores,
				  doSubmitScore);
});















