Game.Entity = function(properties) {
	properties = properties || {};
	// call the glyph's constructor with our set of properties
	Game.Glyph.call(this, properties);
	// instantiate any properties from the passed object
	this._name = properties['name'] || '';
	this._x = properties['x'] || 0;
	this._y = properties['y'] || 0;
	// create an object which will keep track what mixins we have
	// attached to this entity based on the name property
	this._attachedMixins = {};
	// setup the objects mixins
	var mixins = properties['mixins'] || [];
	for (var i = 0; i < mixins.length; i++) {
		//copy over all properties from each mixin as long
		// as it's not the name or the init property. we
		// also make sure not to override a property that
		// already exists on the entity.
		for (var key in mixins[i]) {
			if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
				this[key] = mixins[i][key];
			}
		}
		//add the name of this mixin to our attached mixins
		this._attachedMixins[mixins[i].name] = true
		// finally call the init function if there is one
		if (mixins[i].init) {
			mixins[i].init.call(this, properties);
		}
	}
}

Game.Entity.prototype.hasMixin = function(obj) {
	// allow passing the mixin itself or the name as a string
	if(typeof obj === 'object') {
		return this._attachedMixins[obj.name];
	} else {
		return this._attachedMixins[name];
	}
}

// make entities inherit all the functionality from glyphs
Game.Entity.extend(Game.Glyph);
//$.extend (Game.Entity, Game.Glyph);

Game.Entity.prototype = Object.create(Game.Glyph.prototype);
Game.Entity.prototype.constructor = Game.Entity;

Game.Entity.prototype.setName = function(name) {
	this._name = name;
}

Game.Entity.prototype.setX = function(x) {
    this._x = x;
}
Game.Entity.prototype.setY = function(y) {
    this._y = y;
}
Game.Entity.prototype.getName = function() {
    return this._name;
}
Game.Entity.prototype.getX = function() {
    return this._x;
}
Game.Entity.prototype.getY   = function() {
    return this._y;
}