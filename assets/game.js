/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	return this;
}

var Game = {
	_display: null,
	_currentScreen: null,
	_screenWidth: 80,
	_screenHeight: 24,
	init: function() {
		// any necessary init wil lgo here.
		this._display = new ROT.Display({width: this._screenWidth,
										height: this._screenHeight + 1});
		// create helper function for binding to an event
		// and making ti send to the screen
		var game = this; // so that we don't lose this
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				// when an event is received, send it to the
				// screen if there is one
				if (game._currentScreen !== null) {
					//send the event type and data to the screen
					game._currentScreen.handleInput(event, e);
				}
			});
		}
		// bind keyboard input events
		bindEventToScreen('keydown');
		//bindEventToScreen('keyup');
		bindEventToScreen('keypress');
	},
	refresh: function() {
		// clear the screen
		this._display.clear();
		//render the screen
		this._currentScreen.render(this._display);
	},
	getDisplay: function() {
		return this._display;
	},
	getScreenWidth: function() {
		return this._screenWidth;
	},
	getScreenHeight: function() {
		return this._screenHeight;
	},
	switchScreen: function(screen) {
		// if we had a screen before, notify it that we exited
		if (this._currentScreen !== null) {
			this._currentScreen.exit();
		}
		//clear the display
		this.getDisplay().clear();
		// Update our current screen, notify it we entered
		// and then render it
		this._currentScreen = screen;
		if (!this._currentScreen !== null) {
			this._currentScreen.enter();
			this.refresh();
		}
	}
}

window.onload = function() {
	// check for support fix later
	//init the game
	Game.init();
	//add screen to page
	document.body.appendChild(Game.getDisplay().getContainer());
	// load the start screen
	Game.switchScreen(Game.Screen.startScreen);
}