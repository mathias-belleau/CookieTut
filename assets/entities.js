//create our mixins namespace
Game.Mixins = {};

Game.Mixins.Destructible = {
	name: 'Destructible',
	init: function(template) {
		this._maxHp = template['maxHp'] || 10;
		// we allow takin in hp from the template in case we want
		// the entity to start with a diff amount of hp
		// than max specified
		this._hp = template['hp'] || this._maxHp;
		this._defenseValue = template['defenseValue'] || 0;
	},
	getDefenseValue: function() {
		return this._defenseValue;
	},
	getHp: function() {
		return this._hp;
	},
	getMaxHp: function() {
		return this._maxHp;
	},
	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		// if have 0 or less hp, then remove ourselves from the map
		if (this._hp <= 0) {
			Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
			Game.sendMessage(this, 'You die!');
			this.getMap().removeEntity(this);
		}
	}
}

Game.Mixins.Attacker = {
	name: 'Attacker',
	groupName: 'Attacker',
	init: function(template) {
		this._attackValue = template['attackValue'] || 1;
	},
	getAttackValue: function() {
		return this._attackValue;
	},
	attack: function(target) {
		// if the target is destructible, calc damage
		// based on attack and defense
		if (target.hasMixin('Destructible')) {
			var attack = this.getAttackValue();
			var defense = target.getDefenseValue();
			var max = Math.max(0, attack-defense);
			var damage = 1 + Math.floor(Math.random() * max);

			Game.sendMessage(this, 'You strike the %s for %d damage!',
				[target.getName(), damage]);
			Game.sendMessage(target, 'The %s strikes you for %d damage!',
				[this.getName(), damage]);

			target.takeDamage(this, damage);
		}
	}
}

// Define our moveable mixin
Game.Mixins.Moveable = {
	name: 'Moveable',
	tryMove: function(x, y, z, map) {
		var tile = map.getTile(x, y, this.getZ());
		var target = map.getEntityAt(x, y, this.getZ());
		//if our z level changed check if we are on a stair
		if (z < this.getZ()) {
			if (tile != Game.Tile.stairsUpTile) {
				Game.sendMessage(this, "You can't go up here!");
			} else {
				Game.sendMessage(this, "You ascend to level %d!", [z+1]);
				this.setPosition(x,y,z);
			}
		} else if ( z > this.getZ()) {
			if (tile != Game.Tile.stairsDownTile) {
				Game.sendMessage(this, "You can't go down here!");
			} else {
				this.setPosition(x, y, z);
				Game.sendMessage(this, "You descend to level %d!", [z + 1]);
			}
		//if an entity was present at the tile
		} else if (target) {
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
			this.setPosition(x,y,z);
			return true;
		} else if (tile.isdiggable()){
		//check if the tile isdiggable, and
		// if so try to dig it
			map.dig(x,y,z);
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
		//clear messages
		this.clearMessages();
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
    											this.getY() + yOffset,
    											this.getZ())) {
    					var entity = new Game.Entity(Game.FungusTemplate);
    					entity.setPosition(this.getX() + xOffset,
    							this.getY() + yOffset, this.getZ());
    					this.getMap().addEntity(entity);
    					this._growthsRemaining--;

    					// send a message nearby
    					Game.sendMessageNearby(this.getMap(),
    						entity.getX(), entity.getY(), entity.getZ(),
    						'The fungus is spreading!');
    				}
    			}

    		}
    	}
    }
}

Game.Mixins.MessageRecipient = {
	name: 'MessageRecipient',
	init: function(template) {
		this._messages = [];
	},
	receiveMessage: function(message) {
		this._messages.push(message);
	},
	getMessages: function(){
		return this._messages;
	},
	clearMessages: function() {
		this._messages = [];
	}
}

Game.sendMessage = function(recipient, message, args) {
	// make sure the recipient can receive
	if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
		// if args were passed then we format
		if (args) {
			message = vsprintf(message, args);
		}
		recipient.receiveMessage(message);
	}
}

Game.sendMessageNearby = function(map, centerX, centerY, centerZ, message, args) {
	// if args were passed we format
	if (args) {
		message = vsprintf(message, args);
	}
	//get nearrby entities
	entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);
	// iterate thru and send message
	for (var i = 0; i < entities.length; i++){
		if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
			entities[i].receiveMessage(message);
		}
	}
}

// Player template
Game.PlayerTemplate = {
	character: '@',
	foreground: 'white',
	background: 'black',
	maxHp: 40,
	attackValue: 10,
	mixins: [Game.Mixins.Moveable, Game.Mixins.PlayerActor,
			Game.Mixins.Attacker, Game.Mixins.Destructible,
			Game.Mixins.MessageRecipient]
}

Game.FungusTemplate = {
	name: 'fungus',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
}