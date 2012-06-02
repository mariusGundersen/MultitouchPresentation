define("gui", ["expose"], function(expose){
	
	var _main,
	_synchIcon,
	_loginName;
	
	function init(main){
		_main = main;
		_synchIcon = $("#synch")[0];		
		_loginName = $("#loginName");
	
	
		$("#loginForm").on("submit", onPlayClicked);
		$("a[href=#play]").on("click", onPlayClicked);
		$("a[href=#login]").on("click", onLoginClicked);
		$("a[href=#highscore]").on("click", onHighscoreClicked);
		$("#synch").on("click", onSynchClicked);
		
		
		_loginName.val(localStorage.getItem("name"));
		
		$(window).on("load", function(){setTimeout(scrollTo, 0, 0, 1);});
		
		$(window).on("orientationchange", function(){scrollTo(0,1);});
		
		setTimeout(function(){
			if(document.location.hash.indexOf("#play") === 0){
				onPlayClicked({preventDefault:function(){}});
			}
		
		}, 100);
	}




	function showLogin(){
		showSection($("#login"));
	};

	function showScore(){
		showSection($("#score"));
	};

	function showPlay(){
		showSection($("#play"));
	};

	function populateScores(scores){
		var list = $("#score ul");
		list.empty();
		for(var i=0; i<scores.length; i++){
			list.append("<li>"+scores[i].name+"<span>"+scores[i].score+"</span></li>");
		}
	};

	function synchStarted(){
		_synchIcon.className = "synch";
	};
	function synchFailed(){
		_synchIcon.className = "warning";
	};
	function synchCompleted(){
		_synchIcon.className = "ok";
	};


	function onLoginClicked(e){
		showLogin();
		
		e.preventDefault();
		return false;
	};
	function onPlayClicked(e){
		var form = $("#loginForm");
		if(form[0].checkValidity()){
			_main.startPlay(_loginName.val());
			form.removeClass("invalid");
			localStorage.setItem("name", _loginName.val());
			setTimeout(function(){_loginName.blur()},1);
		}else{
			form.addClass("invalid");
		}
		
		e.preventDefault();
		return false;
	};
	function onHighscoreClicked(e){
		_main.synchScores();
		showScore();
		e.preventDefault();
		return false;
	};
	function onSynchClicked(e){
		_main.synchScores();
		e.preventDefault();
		return false;
	};


	function showSection(section){
		$(".current").toggleClass("current");
		section.toggleClass("current");
	};

	
	return expose(init,
				  showLogin,
				  showPlay,
				  showScore,
				  synchStarted,
				  synchFailed,
				  synchCompleted,
				  populateScores);
});