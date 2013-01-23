	var snakeGame = (function(){
		var canvas = document.getElementById("game"),
			ctx = canvas.getContext("2d"),
			subscriptions = {};
			snakes = [],
			food = [],
			that = {
				paused : false,
				scoreList : $("#scoreList"),
				canvasWidth : canvas.width,
				canvasHeight : canvas.height
			};
			markedForDeletion = [],
			timer = null,
			previousSettings = {};


		function generateFood(){
			_.each(snakes, function(){
				food.push(new snakeFood());
			});
		}

		function showStatus(msg){
			console.log(msg);
		}
		function endGame(msg){
			var data = {
				message: msg
			};

			publish('gameover', data);
			//console.log("Ending game " + msg);
			clearTimer();
		}
		function clearTimer(){
			timer = window.clearInterval(timer);
		}
		function publish(event, data){
			console.log(subscriptions);
			if(subscriptions.hasOwnProperty(event)){
				for(var i = subscriptions[event].length - 1; i >= 0; i--){
					
					subscriptions[event][i].call(null, data);
				}
			}
		}


		that.subscribe = function(fn, event){
			if(!subscriptions.hasOwnProperty(event)){
				subscriptions[event] = [];
			}
			subscriptions[event].push(fn);
		};

		that.getSnakes = function(){
			return snakes;
		}

		that.finalizeDeath = function(snake){
			markedForDeletion.push(snake);//don't delete here, because causes flicker, must delete right before incrementing
		}

		//adds an item to the sidebar list and returns the <span> that contains the actual sidebar
		that.addScoreListItem = function(name, color){
			var li = $("<li>" + name + "<span>0</span>" + "</li>").css('color', color);
			that.scoreList.append(li);
			return li.find("span");
		}
		that.checkCollision = function(obj1, obj2, padding){
			//assuming circular
			var minDist = obj1.r + obj2.r,
				actual = Math.sqrt(Math.pow(obj1.x-obj2.x, 2) + Math.pow(obj1.y-obj2.y, 2));
			if(!padding){
				padding = 0;
			}
			if(actual + padding <= minDist){
				return true;
			}

		}

		that.keydown = function(e){
			var keycode = e.keyCode;
			//console.log(keycode);
			switch(keycode){
				case 80:
					if(that.paused){
						that.pause();
					}
					else{
						that.unpause();
					}

				break;
			}
			_.each(snakes, function(snake){
				if(keycode == snake.leftKey){
					snake.directions.left = true;
				}
				if(keycode == snake.rightKey){
					snake.directions.right = true;
				}
			});
		};

		that.keyup = function(e){
			var keycode = e.keyCode;
			_.each(snakes, function(snake){
				if(keycode == snake.leftKey){
					snake.directions.left = false;
				}
				if(keycode == snake.rightKey){
					snake.directions.right = false;
				}
			});
		}

		that.increment = function(){
			ctx.clearRect(0,0,that.canvasWidth, that.canvasHeight);

			for(var i =0, max = markedForDeletion.length; i < max; i++){
				var singleScore = 0;
				if(snakes.length == 1){
					singleScore = snakes[0].getScore();
				}

				snakes.splice(_.indexOf(snakes, markedForDeletion[i]), 1);
				if(snakes.length == 1){
					//multiple players are playing, this is the last one, this one wins
					endGame("Player " + (snakes[0].snakeIndex + 1) + " wins");
					break;
				}
				else if(snakes.length == 0){
					//must be one player
					endGame("Your score: " + singleScore);
					break;
				}
				else{
					continue;
				}
			};
			markedForDeletion = [];
			_.each(snakes, function(snake){
				snake.increment(ctx);
				//check
				//if snake is colliding with boundaries
				if(snake.head.x - snake.head.r < 0 || snake.head.x + snake.head.r > that.canvasWidth || snake.head.y - snake.head.r < 0 || snake.head.y + snake.head.r > that.canvasHeight){
					snake.die();
				}
				_.each(food, function(f){
					f.paint(ctx);
					//check
					//if food is colliding with head node
					if(that.checkCollision(f, snake.head)){
						//console.log("EAT");
						snake.requestNode();
						f.randomize();
					}	
				});
					
			});

			

		};

		that.pause = function(){
			clearTimer();
			that.paused = false;
		}

		that.unpause = function(){
			timer = window.setInterval(function(){that.increment();}, 50);
			that.paused = true;
		}

		that.restart = function(){
			that.init(previousSettings);
		}

		that.init = function(stg){
			var def = {
				gameType: "single",
				player_map: null
			};
			_.extend(def, stg);

			previousSettings = def;

			//reset everything
			$(scoreList).empty();
			snakes = [];
			food = [];

			if(def.player_map != null){
				for(var i = 0; i < def.player_map.length; i++){
					var ss = {
						snakeIndex: i,
						origX: that.canvasWidth / 10,
						origY: that.canvasHeight / 5,
						leftKey: def.player_map[i].leftKey,
						rightKey: def.player_map[i].rightKey
					};

					switch(i){
						case 1:
							ss.origY = 4 * that.canvasHeight / 5;
							ss.hsc = "#c93939";
							ss.nsc = "#e07373";
							ss.cac = "#F59999";
						break;
						case 2:
							ss.origX = 9 * that.canvasWidth / 10;
							ss.initAngle = Math.PI;
						break;
						case 3:
							ss.origY = 4 * that.canvasHeight / 5;
							ss.origX = 9 * that.canvasWidth / 10;
							ss.initAngle = Math.PI;
						break;
					}
					snakes.push(new Snake(ss));
				}
			}
			else{
				//create snake
				snakes.push(new Snake({origX: that.canvasWidth/2, origY: that.canvasHeight/3}));
			}
			/*
			else{
				snakes.push(new Snake({snakeIndex: 1, origX: that.canvasWidth/2, origY: 2 * that.canvasHeight/3, leftKey: 65, rightKey: 68, hsc: "#c93939", nsc: "#e07373", cac : "#F59999"}))
			}*/

			//add food
			generateFood();
			
			//reset snake(s)
			//use user supplied settings to construct game

			that.unpause();//starts timer
			
			/* set key + mouse listeners */
			$(document).bind('keydown', _.bind(that.keydown, that));
			$(document).bind('keyup', _.bind(that.keyup, that));
			
		}


		return that;
	}());
	
	var Snake = function(stg){
		var that = {
			origX : 100,
			origY: 100,
			initAngle: 0,
			alive: true,
			nc: "#FFF",//node color
			nsc: "#99F",//node stroke color
			hc: "#FFF",//node color
			hsc: "#44D",//node color
			cac : "#99aaf0",//color animation color
			snakeIndex: 0,//default index in the snakes array
			angleQueue : [],
			directions: {
				left: false,
				right: false
			},
			head: null,
			snakeNodes : [],
			leftKey: 37,
			rightKey: 39
		},
		angleSpeed = 15 * Math.PI / 180,//speed at which angle changes (in radians)
		score = 0,
		scoreElem = null,
		colorAnimationIndex = -1,//when set to a positive integer, it begins the animation of eating and adds a node when finished, when set to -1 it remains dormant
		deathAnimationIndex = -1;

		_.extend(that, stg);
		//private
		function addScore(amt){
			score += amt;
			//update sidebar
			scoreElem.html(score);
		}
		function addNode(){
			var newNode;
			if(that.head == null){
				//add it to the middle of the stage
				newNode = new SnakeNode({
					x: that.origX,
					y: that.origY,
					a: that.initAngle,
					sc: that.hsc,
					c: that.hc
				});
				that.head = newNode;
			}
			else{
				var lastNode = (that.snakeNodes.length == 0) ? that.head : _.last(that.snakeNodes),
					newX = lastNode.x + (Math.cos(lastNode.a + Math.PI) * lastNode.r * 2),
					newY = lastNode.y + (Math.sin(lastNode.a + Math.PI) * lastNode.r * 2);
					
				//add it to the end of the chain
				newNode = new SnakeNode({
					x: newX,
					y: newY,
					a: lastNode.a,
					sc: that.nsc,
					c: that.nc
				});

				that.snakeNodes.push(newNode);
			}
		}

		that.die = function(){
			that.head.v = 0;
			_.each(that.snakeNodes, function(node){
				node.v = 0;
			});
			that.alive = false;
			colorAnimationIndex = -1;
			deathAnimationIndex = 0;
		}

		that.requestNode = function(){
			addScore(1);
			if(colorAnimationIndex != -1){
				//currently in progress, add the previously queued one
				addNode();
				//release color on current node
				that.snakeNodes[colorAnimationIndex].c = that.nc;
			}
			colorAnimationIndex = 0;
		}

		that.increment = function(ctx){

			//if animating colors
			if(colorAnimationIndex != -1){
				if(colorAnimationIndex > 0){//if not the first one animated
					//turn off the one that was just on
					that.snakeNodes[colorAnimationIndex].c = that.nc;
				}

				//check
				//if last one
				if(colorAnimationIndex >= that.snakeNodes.length - 1){
					colorAnimationIndex = -1;
					//actually add the node
					addNode();
				}
				else{
					//otherwise, just go to the next one
					colorAnimationIndex++;
					that.snakeNodes[colorAnimationIndex].c = that.cac;
				}
			}

			if(deathAnimationIndex != -1){
				if(that.snakeNodes.length <= 0){
					snakeGame.finalizeDeath(that);
				}
				else{
					that.snakeNodes.shift()
				}
			}
			//

			//if directions are going on, change angle of head node
			if(that.directions.left){
				that.head.a += angleSpeed;
			}
			if(that.directions.right){
				that.head.a -= angleSpeed;
			}
			var prevAngle = that.head.a;

			that.head.increment(that.head.a);
			
			that.head.paint(ctx);

			for(var i = 0, max = that.snakeNodes.length; i < max; i++){
				that.snakeNodes[i].angleQueue.push(prevAngle);
				var tmp = that.snakeNodes[i].angleQueue.shift();//takes first one off of queue

				that.snakeNodes[i].increment(tmp);
				
				prevAngle = tmp;
				that.snakeNodes[i].paint(ctx);//paints nodes here as to prevent from re-iterating through in paint method


				//check
				//if colliding with any of the heads of other snakes (should probably make this a function in snakeGame, but that is a lot of function calls)
				var snakes = snakeGame.getSnakes();
				_.each(snakes, function(snake){
					if(snakeGame.checkCollision(that.snakeNodes[i], snake.head, 1)){
						snake.die();
					}
				});
			}

		}
		that.getScore = function(){
			return score;
		}

		//add to the score list
		scoreElem = snakeGame.addScoreListItem("player " + (that.snakeIndex+1), that.hsc);

		addNode()//add the head
		for(var i =0; i < 10; i++){
			addNode();
		}
		return that;
	};

	var SnakeNode = function(stg){
		var that = {
			x: 10,
			y: 10,
			v: 7,//velocity
			a: 0,//angle
			r: 7,//radius
			c: "#FFF",//color
			sc: "#99F",//stroke color
			angleQueue : []
		};

		_.extend(that, stg);

		//queue length is 2r/v since that is how many increments until the position of the previous node takes the current position
		//not sure which way to round TODO
		for(var i = 0; i < Math.ceil(that.r * 2 / that.v); i++){
			that.angleQueue.push(that.a);
		}

		that.paint = function(ctx){
			ctx.beginPath();
			ctx.arc(that.x, that.y, that.r, 0, Math.PI * 2);
			ctx.fillStyle = that.c;
			ctx.strokeStyle = that.sc;
			ctx.lineWidth = 2;
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}

		that.increment = function(nextAngle){
			that.x += that.v * Math.cos(nextAngle);
			that.y -= that.v * Math.sin(nextAngle);
		}

		return that;
	}

	var snakeFood = function(stg){
		var that = {
			x: 10,
			y: 10,
			r: 7,
			c: "#FFF",//color
			sc: "#2D6",//stroke color
		}

		_.extend(that, stg);

		that.randomize = function(){
			//randomize
			var xRange = snakeGame.canvasWidth - that.r * 2,
				yRange = snakeGame.canvasHeight - that.r * 2;

			that.x = (Math.random() * xRange) + that.r;
			that.y = (Math.random() * yRange) + that.r;

		}

		that.paint = function(ctx){
			ctx.beginPath();
			ctx.arc(that.x, that.y, that.r, 0, Math.PI * 2);
			ctx.fillStyle = that.c;
			ctx.strokeStyle = that.sc;
			ctx.lineWidth = 2;
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}

		that.randomize();
		return that;
	}
