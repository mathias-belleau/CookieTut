//create our mixins namespace
Game.Mixins = {};

// Define our moveable mixin
Game.Mixins.Moveable = {
	name: 'Moveable',
	tryMove: function(x, y, map) {
		var tile = map.getTile(x, y);
		//check if we can walk on the tile
		// if so simply walk onto it
		if( tile.isWalkable()) {
			//update the entity's position
			this._x = x;
			this._y = y;
			return true;
		} else {
		//check if the tile isdiggable, and
		// if so try to dig it
			map.dig(x,y);
			return true;
		}
		return false;
	}
}

// Player template
Game.PlayerTemplate = {
	character: '@',
	foreground: 'white',
	background: 'black',
	mixins: [Game.Mixins.Moveable]
}