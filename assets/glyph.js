Game.Glyph = function(properties) {
	//instantiate properties to default if they weren't passed
	properties = properties || {};
	this._char = properties['character'] || ' ';
	this._foreground = properties['foreground'] || 'white';
	this._background = properties['background'] || 'black';
};

//Create standard getters for glyphs
Game.Glyph.prototype.getChar = function() {
	return this._char;
}
Game.Glyph.prototype.getBackground = function() {
	return this._background;
}
Game.Glyph.prototype.getForeground = function(){
	return this._foreground;
}