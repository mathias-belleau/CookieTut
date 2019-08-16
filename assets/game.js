var Game = {
	_display: null,
	_currentScreen: null,
	init: function() {
		// any necessary init wil lgo here.
		this._display = new ROT.Display({width:80, height:24});
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
		bindEventToScreen('keyup');
		bindEventToScreen('keypress');
	},
	getDisplay: function() {
		return this._display;
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
			this._currentScreen.render(this._display);
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