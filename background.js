function currentWeekNumber(date) {

  if (typeof date === 'string' && date.length) {
    instance = new Date(date);
  } else if (date instanceof Date) {
    instance = date;
  } else {
    instance = new Date();
  }

  // Create a copy of this date object
  var target = new Date(instance.valueOf());

  // ISO week date weeks start on monday
  // so correct the day number
  var dayNr = (instance.getDay() + 6) % 7;

  // ISO 8601 states that week 1 is the week
  // with the first thursday of that year.
  // Set the target date to the thursday in the target week
  target.setDate(target.getDate() - dayNr + 3);

  // Store the millisecond value of the target date
  var firstThursday = target.valueOf();

  // Set the target to the first thursday of the year
  // First set the target to january first
  target.setMonth(0, 1);
  // Not a thursday? Correct the date to the next thursday
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }

  // The weeknumber is the number of weeks between the
  // first thursday of the year and the thursday in the target week
  var weekNumber = 1 + Math.ceil((firstThursday - target) / 604800000);
return weekNumber;
}

function draw() {
	var f = new FontFace('Roboto', 'url(Roboto.woff2)');
	var today = new Date();
	var canvas = document.createElement('canvas');// Create the canvas
	var context = canvas.getContext('2d');
	
	document.fonts.add(f); // Add the font to the DOM
	f.load();
	f.loaded.then(function() {
	  // Ready to use the font in a canvas context
	  canvas.width = 19;
	  canvas.height = 19;
	  context.font = "1.5em Roboto";
	  context.fontWeight = "bolder";
	  context.fillStyle = "#000000";
	  context.textAlign = "center";
	  context.textBaseline = "middle";
	  context.fillText(currentWeekNumber(today), 8, 13);
	  context.font = "0.8em Arial";
	  context.fillText('w', 8, 2);
	  chrome.browserAction.setIcon({
		imageData: context.getImageData(0, 0, canvas.width,canvas.height)
		});	
	});
	
  }

function setup() {
	chrome.alarms.create('refresh', {delayInMinutes: 5, periodInMinutes: 5});
	draw();
}

chrome.runtime.onStartup.addListener(setup);
chrome.alarms.onAlarm.addListener(draw);
chrome.browserAction.onClicked.addListener(draw);
draw();