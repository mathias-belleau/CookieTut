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
			console.log(ROT.VK_RETURN);
			if (inputData.keyCode === ROT.KEYS.VK_RETURN) {
				Game.switchScreen(Game.Screen.playScreen);
			}
		}
	}
}

//define our playing screen
Game.Screen.playScreen = {
	enter: function() { 
		var map = [];
		for (var x = 0; x < 80; x++) {
			//create the nested array for y values
			map.push([]);
			//add all the tiles
			for (var y = 0; y < 24; y++) {
				map[x].push(Game.Tile.nullTile);
			}
		}
		var generator = new ROT.Map.Cellular(80,24);
		generator.randomize(0.5);
		var totalIterations = 3;
		// iterate smoothen the map
		for (var i = 0; i < totalIterations - 1; i++) {
			generator.create();
		}
		// smooteh it one last time and then update our map
		generator.create(function(x,y,v) {
			if (v === 1){
				map[x][y] = Game.Tile.floorTile;
			} else { 
				map[x][y] = Game.Tile.wallTile;
			}
		});
		//create our map from the tiles
		this._map = new Game.Map(map);
	 },
	exit: function() { console.log("Exited play screen."); },
	render: function(display) {
		// iterate through all the map cells
		for (var x = 0; x < this._map.getWidth(); x++) {
			for (var y = 0; y < this._map.getHeight(); y++ ) {
				// fetch the glyph for the tile and render it to the screen
				var glyph = this._map.getTile(x, y).getGlyph();
				display.draw(x,y,
					glyph.getChar(),
					glyph.getForeground(),
					glyph.getBackground());
			}
		}
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
Game.Screen.loseScreen = {
	enter: function() { console.log("Entered lose screen"); },
	exit: function() { console.log("Exited lose screen."); },
	render: function(display) {
		display.drawText(3,5, "%c{red}%b{white}This game lose!");
	},
	handleInput: function(inputType, inputData) {
		//nothing to do here
	}
}


