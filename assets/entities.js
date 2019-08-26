//create our mixins namespace
Game.Mixins = {};

Game.Mixins.Destructible = {
	name: 'Destructible',
	init: function() {
		this._hp = 1;
	},
	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		// if have 0 or less hp, then remove ourselves from the map
		if (this._hp <= 0) {
			this.getMap().removeEntity(this);
		}
	}
}

Game.Mixins.SimpleAttacker = {
	name: 'SimpleAttacker',
	groupName: 'Attacker',
	attack: function(target) {
		// only remove the entity if they were attackable
		if (target.hasMixin('Destructible')) {
			target.takeDamage(this, 1);
		}
	}
}

// Define our moveable mixin
Game.Mixins.Moveable = {
	name: 'Moveable',
	tryMove: function(x, y, map) {
		var tile = map.getTile(x, y);
		var target = map.getEntityAt(x, y);
		if (target) {
			//if we are an attacker try to attack
			// the target
			if (this.hasMixin('Attacker')) {
				this.attack(target);
				return true;
			} else {
				// if not nothing we can do, but we can't
				// move to this tile
				return false;
			}
			
		//check if we can walk on the tile
		// if so simply walk onto it
		} else if( tile.isWalkable()) {
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

//Main player's actor mixin
Game.Mixins.PlayerActor = {
	name: 'PlayerActor',
	groupName: 'Actor',
	act: function() {
		// re-render the screen
		Game.refresh();
		// Lock the engine and wait asynchronously
		// for the player to press a key
		this.getMap().getEngine().lock();
	}
}

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function() {
    	this._growthsRemaining = 5;
    },
    act: function() { 
    	// check if we are going to try growing this turn
    	if (this._growthsRemaining > 0) {
    		if(Math.random() <= 0.02) {
    			// gen the coordinates of a random adjacent square by
    			// generating an offset between [-1, 0, 1] for both the x
    			// and y directions. to do this, we gen a number from
    			// 0-2 and then subtract 1
    			var xOffset = Math.floor(Math.random() * 3) -1;
    			var yOffset = Math.floor(Math.random() * 3) -1;
    			// make sure we aren't trying to spawn on the same tile as us
    			if (xOffset != 0 || yOffset != 0) {
    				// check if we can actually spawn at that location and if so
    				// then we grow
    				if (this.getMap().isEmptyFloor(this.getX() + xOffset,
    											this.getY() + yOffset)) {
    					var entity = new Game.Entity(Game.FungusTemplate);
    					entity.setX(this.getX() + xOffset);
    					entity.setY(this.getY() + yOffset);
    					this.getMap().addEntity(entity);
    					this._growthsRemaining--;
    				}
    			}

    		}
    	}
    }
}

// Player template
Game.PlayerTemplate = {
	character: '@',
	foreground: 'white',
	background: 'black',
	mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
			Game.Mixins.SimpleAttacker, Game.Mixins.Destructible]
}

Game.FungusTemplate = {
    character: 'F',
    foreground: 'green',
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}