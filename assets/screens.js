Game.Screen = {};

// define our initial start screen
Game.Screen.startScreen = {
	enter: function() { console.log("Entered start screen."); },
	exit: function() { console.log("Exited start screen."); },
	render: function(display) {
		//render our prompt to the screen
		display.drawText(1,1,"%c{yellow}Javascript roguelike");
		display.drawText(1,2,"Press [Enter] to start!");
	},
	handleInput: function(inputType, inputData) {
		//when [enter] is pressed, go to the play screen
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.playScreen);
			}
		}
	}
}

//define our playing screen
Game.Screen.playScreen = {
	enter: function() { console.log("Entered play screen"); },
	exit: function() { console.log("Exited play screen."); },
	render: function(display) {
		display.drawText(3,5, "%c{red}%b{white}This game exists!");
		display.drawText(4,6, "Press [Enter] to win, or [Esc] to lose!");
	},
	handleInput: function(inputType, inputData) {
		if ( inputType === 'keydown'){
			//if enter is pressed, go to the win screen
			//if escape is pressed go to lose
			if(inputData.keyCode === ROT.VK_RETURN) {
				Game.switchScreen(Game.Screen.winScreen);
			} else if (inputData.keyCode === ROT.VK_ESCAPE) {
				Game.switchScreen(Game.Screen.loseScreen);
			}
		}
	}
}

//define our win screen
Game.Screen.winScreen = {
	enter: function() { console.log("Entered win screen"); },
	exit: function() { console.log("Exited win screen."); },
	render: function(display) {
		// render our prompt to the screen
		for (var i = 0; i < 22; i++) {
			// generate random background colors
			var r = Math.round(Math.random() * 255);
			var g = Math.round(Math.random() * 255);
			var b = Math.round(Math.random() * 255);
			var background = ROT.Color.toRGB([r,g,b]);
			display.drawText(2, i + 1, "%b{" + background + "}You win!");
		}
	},
	handleInput: function(inputType, inputData) {
		//nothing to do here
	}
}

//define our playing screen
Game.Screen.playScreen = {
	enter: function() { console.log("Entered play screen"); },
	exit: function() { console.log("Exited play screen."); },
	render: function(display) {
		display.drawText(3,5, "%c{red}%b{white}This game exists!");
		display.drawText(4,6, "Press [Enter] to win, or [Esc] to lose!");
	},
	handleInput: function(inputType, inputData) {
		//nothing to do here
	}
}


