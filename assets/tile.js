Game.Tile = function(properties) {
	properties = properties || {};
	// call the glyph constructor with our properties
	Game.Glyph.call(this, properties);
	//set up the properties. we use false by default
	this._isWalkable = properties['isWalkable'] || false;
	this._isDiggable = properties['isDiggable'] || false;
};

// make tiles inherit all the functionality from glyphs
Game.Tile.extend(Game.Glyph);
//$.extend (Game.Tile, Game.Glyph);

//standard getters
Game.Tile.prototype.isWalkable = function() {
    return this._isWalkable;
}
Game.Tile.prototype.isDiggable = function() {
    return this._isDiggable;
}

Game.getNeighborPositions = function(x, y) {
	var tiles = [];
	// generate all possible offsets
	for (var dX = -1; dX < 2; dX++) {
		for (var dY = -1; dY < 2; dY++){
			// make sure it isn't the same tile
			if( dX == 0 && dY ==0) {
				continue;
			}
			tiles.push({x: x + dX, y: y + dY});
		}
	}
	return ROT.RNG.shuffle(tiles);
	//return tiles.randomize();
}

Game.Tile.nullTile = new Game.Tile({});
Game.Tile.floorTile = new Game.Tile({
	character: '.',
	isWalkable: true
});
Game.Tile.wallTile = new Game.Tile({
	character: '#',
	foreground: 'goldenrod',
	isDiggable: true
	});
Game.Tile.stairsUpTile = new Game.Tile({
	character: '<',
	foreground: 'white',
	isWalkable: true
});
Game.Tile.stairsDownTile = new Game.Tile({
	character: '>',
	foreground: 'white',
	isWalkable: true
});
