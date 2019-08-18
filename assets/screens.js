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
	_map: null,
	_player: null,
	enter: function() { 
		var map = [];
		//create map based on params
		var mapWidth = 500;
		var mapHeight = 500;
		for (var x = 0; x < mapWidth; x++) {
			//create the nested array for y values
			map.push([]);
			//add all the tiles
			for (var y = 0; y < mapHeight; y++) {
				map[x].push(Game.Tile.nullTile);
			}
		}
		var generator = new ROT.Map.Cellular(mapWidth,mapHeight);
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

		//create our map from the tiles
		this._map = new Game.Map(map);
		//create our player and set the position
		this._player = new Game.Entity(Game.PlayerTemplate);
		var position = this._map.getRandomFloorPosition();
		console.log("start position: " + position.x + ":"+ position.y);
		this._player.setX(position.x);
		this._player.setY(position.y);
	 },
	exit: function() { console.log("Exited play screen."); },
	render: function(display) {
		var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();
        // Make sure the x-axis doesn't go to the left of the left bound
        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);
        // Make sure the y-axis doesn't above the top bound
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));
        // Make sure we still have enough space to fit an entire game screen
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);
        // Iterate through all visible map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                // Fetch the glyph for the tile and render it to the screen
                // at the offset position.
                var tile = this._map.getTile(x, y);
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.getChar(), 
                    tile.getForeground(), 
                    tile.getBackground())
            }
        }
		//render the player
		display.draw(
            this._player.getX() - topLeftX, 
            this._player.getY() - topLeftY,    
            this._player.getChar(), 
            this._player.getForeground(), 
            this._player.getBackground()
        );
	},
	handleInput: function(inputType, inputData) {
		if ( inputType === 'keydown'){
			console.log(inputData.keyCode);
			//if enter is pressed, go to the win screen
			//if escape is pressed go to lose
			if(inputData.keyCode === ROT.KEYS.VK_RETURN) {
				Game.switchScreen(Game.Screen.winScreen);
			} else if (inputData.keyCode === ROT.KEYS.VK_ESCAPE) {
				Game.switchScreen(Game.Screen.loseScreen);
			}

			//movment
			if (inputData.keyCode === ROT.KEYS.VK_LEFT) {
				this.move(-1,0);
			} else if (inputData.keyCode === ROT.KEYS.VK_RIGHT){
				this.move(1,0);
			} else if (inputData.keyCode === ROT.KEYS.VK_UP){
				this.move(0, -1);
			} else if (inputData.keyCode === ROT.KEYS.VK_DOWN){
				this.move(0,1);
			}
		}
	},
	move: function(dX, dY){
		var newX = this._player.getX() + dX;
		var newY = this._player.getY() + dY;
		// try to move to the new cell
		this._player.tryMove(newX, newY, this._map);
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


