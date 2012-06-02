define("main", ["expose",
				"gui", 
				"game", 
				"backend"], function(expose,
									 _gui, 
									 _game, 
									 _backend){
	var _playerName,
		_canvas,
		_main;

	function init(){
		_canvas = $("#canvas");
		_gui.init(_main);
		_game.init(_main);
		_backend.init(_gui);
	};

	function startPlay(name){

		_playerName = name;

		_gui.showPlay();
		
		_canvas.off("click", submitScore);
		_game.startNewGame(onGameEnded);
		
	};

	function onGameEnded(){

		_canvas.on("click", submitScore);
	};

	function synchScores(){
		_backend.doGetScores(onScoresUpdated);
	};

	function onScoresUpdated(data){
		_gui.populateScores(data.results);
	};

	function submitScore(e){
		var score = _game.score;
		var name = _playerName;
		_backend.doSubmitScore(score, name, onScoreSubmitted);
		_gui.showScore();
		
		e.preventDefault();
		return false;
	};

	function onScoreSubmitted(data){
		synchScores();
	};

	
	_main = expose(startPlay,
				   onGameEnded,
				   synchScores,
				   submitScore);


	$(function(e){
		init();

	});
});