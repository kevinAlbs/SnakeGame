	var hasLocalStorage = "localStorage" in window && window["localStorage"] !== null;
	//snakeGame.init();
	/* high score delimiters are as follows
		<score>-<HH:MM:SS>-<MM/DD/YYYY>|<score>...
	*/
	var overlayScreen = (function(){
		var overlayScreen = $("#overlayContainer"),
			titleScreen = $(".screen.title"),
			controlsScreen = $(".screen.controls"),
			instructionsScreen = $(".screen.instructions"),
			numberScreen = $(".screen.number"),
			gameoverScreen = $(".screen.gameover"),
			highscoresScreen = $(".screen.highscores"),
			feedback = $("#feedback"),
			feedbackTimer = null,
			currentScore = -1,
			playerTemplate = $(".player").detach()
			sidebar = $("#sidebar"),
			currentScreen = "title",
			gameSettings = {
				gameType: "single",
				player_amt: 4,
				player_map: []//keymap for each player
			};


		function changeKey(elem, keyCode){
				var html = getCharacter(keyCode);
				elem.find("span.letter").html(html);
				//also update unicode
				elem.find(".unicode span").html(keyCode);
		}
		function showFeedback(text, clss){
			feedbackTimer = window.clearTimeout(feedbackTimer);
			feedback.removeClass().addClass(clss).html(text).show();
			feedbackTimer = window.setTimeout(function(){feedback.fadeOut();}, 10000);
		}
		function getHighScores(){
			var hs = [];
			if(hasLocalStorage){
				var highScores = localStorage.getItem("highscores");
				if(highScores == null){
					//no high scores set
					return hs;
				}
				//split it up			
				var iscore = highScores.split("|"); //individual score
				
				for(var i = 0; i < iscore.length; i++){
					var parts = iscore[i].split("-");
					//first part is actual score
					var objScore = {};
					objScore.score = parts[0];
					objScore.time = parts[1];
					objScore.date = parts[2];
					hs.push(objScore);
				}
			}
			else{
				showFeedback("You must have a browser which supports local storage to save scores", "error");
			}
			return hs;
		}
		function writeHighScores(hs){
			var output = "";
			if(hasLocalStorage){
			for(var i = 0; i < hs.length; i++){
				output += "|" + hs[i].score + "-" + hs[i].time + "-" + hs[i].date;
			}
			if(output.length > 0)
				output = output.substring(1);
			console.log(output);
			localStorage.setItem("highscores", output);
			}
			else{
				showFeedback("You must have a browser which supports local storage to save scores", "error");
			}

		}



		function showScreen(screenName){
			switch(screenName){
				case "controls":
					var players = $("<div></div>");
					//see how many players are necessary
					for(var i = 0; i < gameSettings.player_amt; i++){
						var clone = playerTemplate.clone();
						clone.attr("data-player", i+1);

						//customize
						clone.find("h2").html("Player " + (i+1));
						players.append(clone);

						switch(i){
							case 1:
								changeKey(clone.find(".key:eq(0)"), 81);
								changeKey(clone.find(".key:eq(1)"), 87);
							break;
							case 2:
								changeKey(clone.find(".key:eq(0)"), 78);
								changeKey(clone.find(".key:eq(1)"), 77);
							break;
							case 3:
								changeKey(clone.find(".key:eq(0)"), 90);
								changeKey(clone.find(".key:eq(1)"), 88);
							break;
						}
					}

					$("#playerContainer").empty().append(players);

					//using settings, instantiate controls
					$(document).bind("keydown", function(e){
						console.log(e.keyCode);
						//update any editable keys
						var editableKey = $(".key.editable");
						changeKey(editableKey, e.keyCode);
					});

				break;
				case "gameover":
					if(gameSettings.gameType == "single"){
						gameoverScreen.find("li[data-action=submit]").show();
					}
				break;
				case "highscores":
					//clear the high scores
					highscoresScreen.find("ol li").detach();
					//set the high scores
					var hs = getHighScores();
					var list = highscoresScreen.find("ol");	
					if(hs.length == 0){
						showFeedback("You have no scores set yet, go play!", "error");
					}
					for(var i = 0; i < hs.length; i++){
						list.append("<li>" + hs[i].score + " on " + hs[i].date + " at " + hs[i].time + "</li>");	
					}
				break;

			}
			currentScreen = screenName;
			$(".screen." + screenName).show();
		}

		function hideScreen(screenName){
			switch(screenName){
				case "controls":
					//unbind events
					$(document).unbind("keydown");
					//set new data
					gameSettings.player_map = [];
					controlsScreen.find(".player").each(function(index, elem){
						var l = parseInt($(elem).find(".key:eq(0) .unicode span").html());//left unicode
						var r = parseInt($(elem).find(".key:eq(1) .unicode span").html());
						gameSettings.player_map.push({
							leftKey: l,
							rightKey: r
						});
					});

				break;
			}
			$(".screen." + screenName).hide();
		}
		$("a[data-action=back]").bind("click", function(e){
			e.preventDefault();
			hideScreen(currentScreen);
			showScreen("title");
		});

		titleScreen.find("*[data-action]").bind("click",  function(e){
			e.preventDefault();
			var action = $(e.currentTarget).attr("data-action");
			switch(action){
				case "play_single":
					gameSettings.gameType = "single";
					gameSettings.player_amt = 1;
					hideScreen("title");
					showScreen("controls");
				break;
				case "play_multiplayer":
					gameSettings.gameType = "multiplayer";
					hideScreen("title");
					showScreen("number");
				break;
				case "instructions":
					hideScreen("title");
					showScreen("instructions");
				break;
				case "highscores":
					hideScreen("title");
					showScreen("highscores");
				break;
			}
			return false;
		});

		controlsScreen.find("*[data-action]").bind("click",  function(e){
			e.preventDefault();
			var action = $(e.currentTarget).attr("data-action");
			switch(action){
				case "continue":
					hideScreen("controls");
					overlayScreen.hide();
					sidebar.show();
					snakeGame.init(gameSettings);
				break;
			}
			return false
		});

		numberScreen.find("*[data-action]").bind("click",  function(e){
			e.preventDefault();
			var action = $(e.currentTarget).attr("data-action");
			switch(action){
				case "continue":
					var num = parseInt(numberScreen.find("input[type=number]").val());

					if(isNaN(num) || num > 4 || num < 1){
						console.log("Here");
						num = 4;
					}

					gameSettings.player_amt = num;
					hideScreen("number");
					showScreen("controls");
					
				break;
			}
			return false;
		});


		gameoverScreen.find("*[data-action]").bind("click",  function(e){
			e.preventDefault();
			var action = $(e.currentTarget).attr("data-action");
			switch(action){
				case "restart":
					overlayScreen.hide();
					snakeGame.restart();
				break;
				case "new":
					hideScreen("gameover");
					showScreen("title");
				break;
				case "submit":
					//add to localstorage

					if(hasLocalStorage){

						//remove button
						gameoverScreen.find("li[data-action=submit]").hide();
						
						if(currentScore == -1){
							return;//ignore
						}
						var highscores = getHighScores();
						//find the date 
						var d = new Date();
						var cur = {
							score: currentScore,
							date: "" + (d.getMonth()+1) + "/" + d.getDay() + "/" + d.getFullYear(),
							time: "" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
						};
						var added=false;

						//linear search
						console.log("Length: " + highscores.length);
						for(var i = 0; i < highscores.length; i++){
							if(currentScore > highscores[i].score){
								console.log("HERE!");
								highscores.splice(i, 0, cur);
								added=true;
								break;
							}
						}

						if(!added){
							highscores.push(cur);
							added=true;
						}
							
						if(highscores.length >= 10){
							//truncate
							highscores.splice(10, highscores.length - 10);	
						}

						writeHighScores(highscores);
						showFeedback("Your high score has been set", "success");	
					}
					else{
					}
				break;
			}
		});


		$(".key").live("click", function(e){
			var that = $(this),
				note = that.find(".note"),
				add = true;//says whether or not to add the class

			if(that.hasClass("editable")){
				add = false;
			}

			$(".key").removeClass("editable").find(".note").html("Click to edit");

			if(add){
				note.html("Type a key<br/>Then click to save");	
				that.addClass("editable");
			}

		});

		function onGameover(data){
			gameoverScreen.find(".msg").html(data.message);
			showScreen("gameover");
			overlayScreen.show();
			currentScore = data.score;
		}
		//subscribe to the gameover event
		snakeGame.subscribe(onGameover, "gameover");

		showScreen('title');

	}());


	 function getCharacter(charCode) {	
	 	var val = "";
	 	val = String.fromCharCode(charCode);
		if (charCode == 8) val = "backspace"; //  backspace	 
		if (charCode == 9) val = "tab"; //  tab	 
		if (charCode == 13) val = "enter"; //  enter	 
		if (charCode == 16) val = "shift"; //  shift	
		if (charCode == 17) val = "ctrl"; //  ctrl	
		if (charCode == 18) val = "alt"; //  alt	
		if (charCode == 19) val = "pause/break"; //  pause/break	
		if (charCode == 20) val = "caps lock"; //  caps lock	
		if (charCode == 27) val = "escape"; //  escape	
		if (charCode == 33) val = "page up"; // page up, to avoid displaying alternate character and confusing people	
		if (charCode == 34) val = "page down"; // page down	
		if (charCode == 35) val = "end"; // end	
		if (charCode == 36) val = "home"; // home	
		if (charCode == 37) val = "&#8592;"; // left arrow	
		if (charCode == 38) val = "&#8593"; // up arrow	
		if (charCode == 39) val = "&#8594;"; // right arrow	
		if (charCode == 40) val = "&#8595"; // down arrow	
		if (charCode == 45) val = "insert"; // insert	
		if (charCode == 46) val = "delete"; // delete	
		if (charCode == 91) val = "left window"; // left window	
		if (charCode == 92) val = "right window"; // right window	
		if (charCode == 93) val = "select key"; // select key	
		if (charCode == 96) val = "0"; // 0	
		if (charCode == 97) val = "1"; // 1	
		if (charCode == 98) val = "2"; // 2	
		if (charCode == 99) val = "3"; // 3	
		if (charCode == 100) val = "4"; // 4	
		if (charCode == 101) val = "5"; // 5	
		if (charCode == 102) val = "6"; // 6	
		if (charCode == 103) val = "7"; // 7	
		if (charCode == 104) val = "8"; // 8	
		if (charCode == 105) val = "9"; // 9	
		if (charCode == 106) val = "multiply"; // multiply	
		if (charCode == 107) val = "add"; // add	
		if (charCode == 109) val = "subtract"; // subtract	
		if (charCode == 110) val = "decimal point"; // decimal point	
		if (charCode == 111) val = "divide"; // divide	
		if (charCode == 112) val = "F1"; // F1	
		if (charCode == 113) val = "F2"; // F2	
		if (charCode == 114) val = "F3"; // F3	
		if (charCode == 115) val = "F4"; // F4	
		if (charCode == 116) val = "F5"; // F5	
		if (charCode == 117) val = "F6"; // F6	
		if (charCode == 118) val = "F7"; // F7	
		if (charCode == 119) val = "F8"; // F8	
		if (charCode == 120) val = "F9"; // F9	
		if (charCode == 121) val = "F10"; // F10	
		if (charCode == 122) val = "F11"; // F11	
		if (charCode == 123) val = "F12"; // F12	
		if (charCode == 144) val = "num lock"; // num lock	
		if (charCode == 145) val = "scroll lock"; // scroll lock	
		if (charCode == 186) val = ";"; // semi-colon	
		if (charCode == 187) val = "="; // equal-sign	
		if (charCode == 188) val = ","; // comma	
		if (charCode == 189) val = "-"; // dash	
		if (charCode == 190) val = "."; // period	
		if (charCode == 191) val = "/"; // forward slash	
		if (charCode == 192) val = "`"; // grave accent	
		if (charCode == 219) val = "["; // open bracket	
		if (charCode == 220) val = "\\"; // back slash	
		if (charCode == 221) val = "]"; // close bracket	
		if (charCode == 222) val = "'"; // single quote	

		return val;
	}
