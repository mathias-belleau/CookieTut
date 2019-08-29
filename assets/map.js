Game.Map = function(tiles, player) {
	this._tiles = tiles;
	// cache the width and height based
	// on the length of the dimensions of
	// the tiles array
	this._width = tiles.length;
	this._height = tiles[0].length;

	//create a list which will hold the entities
	this._entities = [];
	//creat the engine and scheduler
	this._scheduler = new ROT.Scheduler.Simple();
	this._engine = new ROT.Engine(this._scheduler);
	// add the player
	console.log(player);
	this.addEntityAtRandomPosition(player);
	// add random fungi
	for (var i = 0; i < 500; i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.FungusTemplate));
	}
};

Game.Map.prototype.addEntity = function(entity) {
	//make sure the entity's position is within bounds
	if (entity.getX() < 0 || entity.getX() >= this._width ||
        entity.getY() < 0 || entity.getY() >= this._height) {
        throw new Error('Adding entity out of bounds.');
    }
    //update the entity's map
    entity.setMap(this);
    // add the entity to the list of entities
    this._entities.push(entity);
    // check if this entity is an actor, and if so add
    // them to the scheduler
    if (entity.hasMixin('Actor')) {
    	this._scheduler.add(entity, true);
    }
}

Game.Map.prototype.addEntityAtRandomPosition = function(entity) {
	var position = this.getRandomFloorPosition();
	entity.setX(position.x);
	entity.setY(position.y);
	this.addEntity(entity);
}

Game.Map.prototype.getEngine = function() {
	return this._engine;
}
Game.Map.prototype.getEntities = function() {
    return this._entities;
}

Game.Map.prototype.getEntityAt = function(x, y) {
	//iterate through all entites searching for one with
	// matching position
	for (var i = 0; i < this._entities.length; i++) {
		if (this._entities[i].getX() == x && this._entities[i].getY() == y) {
			return this._entities[i];
		}
	}
	return false;
}


Game.Map.prototype.isEmptyFloor = function(x, y) {
	// check if the tile is floor and also has no entity
	return this.getTile(x, y) == Game.Tile.floorTile &&
		!this.getEntityAt(x, y);
}

Game.Map.prototype.removeEntity = function(entity) {
	// find the entity in the list of entities if it is present
	for (var i = 0; i < this._entities.length; i++) {
		if (this._entities[i] == entity) {
			this._entities.splice(i, 1);
			break;
		}
	}
	// if the entity is an actor, remove them from scheduler
	if (entity.hasMixin('Actor')) {
		this._scheduler.remove(entity);
	}
}

Game.Map.prototype.dig = function(x,y) {
	// if the tile is diggable, update it to a floor
	if(this.getTile(x, y).isDiggable()) {
		this._tiles[x][y] = Game.Tile.floorTile;
	}
}

Game.Map.prototype.getRandomFloorPosition = function() {
	//randomly generate a tile which is a floor
	var x, y;
	do {
		x = Math.floor(Math.random() * this._width);
		y = Math.floor(Math.random() * this._height);
	} while(!this.isEmptyFloor(x, y));
	return{x: x, y: y};
}

// standard getters
Game.Map.prototype.getWidth = function() {
	return this._width;
};

Game.Map.prototype.getHeight = function() {
	return this._height;
};

// gets the tile for a given coordinate set
Game.Map.prototype.getTile = function(x,y) {
	// make sure we are inside the bounds. if we aren't, return
	// null tile.
	if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
		return Game.Tile.nullTile;
	} else {
		return this._tiles[x][y] || Game.Tile.nullTile;
	}
};

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
	results = [];
	// determine our bounds
	var leftX = centerX - radius;
	var rightX = centerX + radius;
	var topY = centerY - radius;
	var bottomY = centerY + radius;

	//iterate thru our entites, adding any which are within bounds
	for (var i = 0; i < this._entities.length; i++) {
		if (this._entities[i].getX() >= leftX &&
            this._entities[i].getX() <= rightX && 
            this._entities[i].getY() >= topY &&
            this._entities[i].getY() <= bottomY) {
            results.push(this._entities[i]);
        }
	}
	return results;
}