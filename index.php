<html>
<head>
	<title>Snake</title>
	<link href='http://fonts.googleapis.com/css?family=Fredoka+One' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Pontano+Sans' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Muli' rel='stylesheet' type='text/css'>

	<style>
	.clearfix:after {
		content: ".";
		display: block;
		clear: both;
		visibility: hidden;
		line-height: 0;
		height: 0;
	}
	 
	.clearfix {
		display: inline-block;
	}
	 
	html[xmlns] .clearfix {
		display: block;
	}
	 
	* html .clearfix {
		height: 1%;
	}
	*{
		margin: 0px;
		padding: 0px;
		font-family: "Muli", "Helvetica", "Arial";
	}
	canvas{
		border: 2px #AAF solid;
	}

	#sidebar{
		width: 200px;
		position: absolute;
		right: -205px;
		padding-left: 5px;
		display: none;
	}
	#sidebar ul{
		list-style-type: none;
	}
	#sidebar li{
		font-size: 12px;
		position: relative;
		width: 100px;
	}
	#sidebar li span{
		position: absolute;
		right: 0px;
	}
	#sidebar p{
		color: #AAF;
		margin-bottom: 3px;
	}

	#container{
		width: 804px;
		height: 604px;
		margin: 10px auto;
		position: relative;
	}
	#overlayContainer{
		position: absolute;
		width: 800px;
		height: 598px;
		top: 2px;
		left: 2px;
		background-color: rgba(255,255,255,.75);
	}

	#overlayContainer .screen.title{
		padding-left: 200px;
		padding-top: 100px;
	}
	.screen{
		display: none;
		position: relative;
		z-index: 10;
	}
	.screen h1{
		color: #44D;
		font-size: 44px;
		font-weight: normal;
	}
	.screen h2, .screen.title li p{
		font-size: 14px;
		color: #99F;
		font-weight: normal;
	}

	.screen.title h2{
		margin-bottom: 10px;
		margin-top: -5px;
	}

	.screen li p{
		width: 500px;
		height: 0px;
		overflow: hidden;
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
		filter: alpha(opacity=0);
		opacity: 0;
		-webkit-transition-property: opacity, height;
		-moz-transition-property: opacity, height;
		-o-transition-property: opacity, height;
		-ms-transition-property: opacity, height;
		transition-property: opacity, height;
		-webkit-transition-duration: .25s;
		-moz-transition-duration: .25s;
		-o-transition-duration: .25s;
		-ms-transition-duration: .25s;
		transition-duration: .25s;
	}

	.screen li:hover p{
		height: 30px;
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
		filter: alpha(opacity=100);
		opacity: 1;
	}
	.screen li:hover p.twoLines{
		height: 50px;
	}
	.screen ul{
		list-style-type: none;
	}
	.screen li{
		font-size: 28px;
		cursor: pointer;
		color: #99F;
	}

	.screen li:hover{
		color: #44D;
	}
	.screen{
		padding-left: 200px;
		padding-top: 100px;
	}
	.screen.controls, .screen.instructions{
		position: relative;
		width: 430px;
	}
	.screen.controls .player{
		float: left;
		padding-bottom: 10px;
		margin-right: 30px;

	}
	.screen.controls .player h2{
		margin-bottom: 5px;
	}
	.screen.controls p, .screen.instructions p{
		color: #99F;
	}
	.screen.controls h2, .screen.controls p b{
		color: #44D;
		font-weight: normal;
	}
	.screen.controls .player .key{
		float: left;	
		margin-right: 10px;
		position: relative;
		width: 75px;
		font-size: 12px;
	}

	.screen.controls .player .key .letter{
		display: block;
		text-align: center;
		border: 2px #AAF solid;
		background-color: #DDF;
		color: #44D;
		font-size: 36px;
		height: 65px;
		padding-top: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.screen.controls .player .key.editable .letter{
		background-color: #FFFAAD;
		color: #A3A327;
		border-color: #C4C435;
	}

	.screen.controls .player .key:hover .note, .screen.controls .player .editable .note{
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
		filter: alpha(opacity=100);
		opacity: 1;
	}
	.screen.controls .player .editable .note{
		top: -57px;
		width: 100px;
	}
	.screen.controls .player .note{
		position: absolute;
		cursor: pointer;
		width: 80px;
		z-index: 2;
		top: -28px;
		left: 0px;
		font-size: 12px;
		color: #FFF;
		background-color: rgb(0,0,0);
		padding: 5px;
		border-radius: 5px;
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
		filter: alpha(opacity=0);
		opacity: 0;
		-webkit-transition: opacity .25s linear;
		-moz-transition: opacity .25s linear;
		-o-transition: opacity .25s linear;
		-ms-transition: opacity .25s linear;
		transition: opacity .25s linear;

	}

	.screen.controls .player .key .note:after{
		content: "";
		display: block;
		width: 10px;
		height: 10px;
		-webkit-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		position: absolute;
		bottom: -5px;
		left: 7px;
		background-color: rgb(0,0,0);
	}

	.screen.controls .unicode{
		font-size: 10px;
		display: none;
	}
	.screen.controls .unicode span{
		font-weight: bold;
	}
	.screen.instructions h2{
		font-size: 18px;
		font-weight: bold;
	}
	.bottom{
		clear:both; 
		text-align: right;
		width: 360px;
		padding-top: 20px;
		position: relative;
	}
	.continue, .back{
		display: block;
		text-decoration: none;
		width: 100px;
		padding: 10px;
		text-align: center;
		border: 2px #AAF solid;
		background-color: #DDF;
		color: #44D;
		border-radius: 5px;
		margin-left: auto;
	}
	.back{
		background-color: #FFD;
		color: #AA4;
		border-color: #AA4;
		position: absolute;
		left: 0px;
	}
	.screen.number input{
		font-size: 24px;
		border: 2px #AAF solid;
		margin-bottom: 10px;
		background-color: #DDF;
		padding: 5px;
	}

	.screen.gameover ul{
		margin-top: 10px;
	}
	#feedback{
		padding: 5px;
		position: absolute;
		z-index: 10;
		display: none;
		top: 0px;
		left: 0px;
	}
#feedback.success{
	color: #093;
}
#feedback.error{
	color: #500;
}
.screen.highscores ol li{
	font-size: 16px;
}
.screen.highscores ol{
	padding-left: 20px;
}
	</style>
</head>
<body>
<div id="container">

	<div id="overlayContainer">
		<p id="feedback">Feedback</p>
		<div data-screen="title" class="title screen">
			<h1>Snake</h1>
			<h2>Just another snake game</h2>
			<ul>
				<li data-action="play_single">
					Single Player
					<p>Regular snake, collect as many pellets as possible without dying</p>
				</li>
				<li data-action="play_multiplayer">
					Multiplayer
					<p class="twoLines">Play with multiple people locally on your computer. Win by collecting as many pellets as possible and entrapping your opponents.</p>
				</li>
				<li data-action="instructions">Instructions
					<p>Learn how to play</p>
				</li>
				<li data-action="highscores">High Scores
					<p>View your personal top scores</p>
				</li>
			</ul>
		</div><!--/title -->

		<div data-screen="controls" class="controls screen">
			<h1>Before you play</h1>
			<p>Getting a pellet <b>1 point</b></p>
			<p>(Multiplayer only) Entrapping another player <b>10 points</b></p><br/>
			<p>The keyboard controls are shown below. You can edit them by clicking them.</p><br/>
			<div id="playerContainer">
				<div class="player clearfix">
					<h2>Player 1</h2>
					<div class="key">
						<div class="note">Click to edit</div>
						<span class="letter">&#8592;</span>
						<p>move left</p>
						<span class="unicode">unicode <span data-key="leftKey">37</span></span>
					</div>
			
					<div class="key">
						<div class="note">Click to edit</div>
						<span class="letter">&#8594;</span>
						<p>move right</p>
						<span class="unicode">unicode <span data-key="rightKey">39</span></span>
					</div>
				</div>
			</div>

		<div class="bottom">
			
			<a href="" class="back" data-action="back">Back</a>
			<a href="" class="continue" data-action="continue">Play</a>
		</div>
		</div><!--/controls -->

		<div data-screen="number" class="number screen">
			<h1>Number of Players</h1>
			<input type="number" max="4" min="1" value="2"/>
			<div class="bottom">
				<a href="" class="back" data-action="back">Back</a>
				<a href="" class="continue" data-action="continue">Continue</a>
			</div>
		</div><!--/number -->
		<div data-screen="highscores" class="highscores screen">
			<h1>Your Top 10</h1>
			<ol>
				<li>10 set 1/23/2013 at 9:36pm</li>
				<li>8</li>
				<li>1</li>
			</ol>
		<div class="bottom">
			<a href="" class="back" data-action="back">Back</a>
		</div>

		</div><!--/high_scores -->
		<div data-screen="instructions" class="instructions screen">
			<h1>To Play:</h1>
			<h2>Single Player</h2>
			<p>Use the arrow keys (or whichever keys you assign) to move your snake left and right. The point of the game is to collect the pellets which appear on the screen. Avoid colliding with the walls and the snakes own body.</p>
			<h2>Multiplayer</h2>
			<p>In multiplayer, players can collide with each other.</p>
			<div class="bottom">
				<a href="" class="back" data-action="back">Back</a>
			</div>
		</div><!--/instructions -->

		<div data-screen="gameover" class="gameover screen">
			<h1>Game Over</h1>
			<div class="msg">
				<p>The winner is <b>Player 2</b></p>
			</div>
			<ul>
				<li data-action="restart">
					Restart
				</li>
				<li data-action="submit">
					Submit Score
				</li>
				<li data-action="new">
					Main Menu
				</li>
			</ul>

		</div><!--/gameover -->

	</div><!--/#overlayContainer -->

	
	<div id="sidebar">
		<p>scores</p>
		<ul id="scoreList">
			<!--
			<li>
				player 1: <span>0</span>
			</li>
			-->
		</ul>
	</div>
	<canvas id="game" width="800" height="600"></canvas>
	<footer id="pageFooter">
		<small>Developed by <a href="http://kevinalbs.com" target="_blank">Kevin Albertson</a></small><br/>
		<small>View the source on <a href="https://github.com/kevinAlbs/snakeGame" target="_blank">Github</a></small>
	</footer>
</div>
<script src="jquery.js"></script>
<script src="underscore.js"></script>
<script src="snake.js"></script>
<script src="ui.js"></script>

</body>
</html>
