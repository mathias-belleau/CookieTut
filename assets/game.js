//check if rot.js can work on this browser
//good to go
var display = new ROT.Display({width:80, height:20});
var container = display.getContainer();
//add the container to our HTML page
document.body.appendChild(container);

var foreground, background, colors;

for (var i = 0; i < 15; i++) {
	//calc the foreground color, getting progressively darker
	// and the background color, getting progressively lighter.
	foreground = ROT.Color.toRGB([255 - (i*20),
								  255 - (i*20),
								  255 - (i*20)]);
	background = ROT.Color.toRGB([i*20, i*20, i*20]);
	//create the color format specifier.
	colors = "%c{" + foreground + "}%b{" + background + "}";
	// raw the text at col 2 and row i
	display.drawText(2, i, colors + "Hello, world!");
}
