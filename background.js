chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
	var OrigTitle = request.title;
	var title = request.title.replace(/ /g, "+");
	title = title.substring(0, title.indexOf('\n'));
	
	var request = new XMLHttpRequest();
	
	request.open('GET', 'http://www.omdbapi.com/?t=' + title + '&apikey=776dc5b', true);
	request.onload = function () {
		
		var data = JSON.parse(request.response);
		if (data.Response == 'True') {
			console.log(data);
			if (data.Ratings.length == 3) {
				console.log(data.imdbRating);
				console.log(data.Ratings[1].Value);
				console.log(data.Ratings[2].Value);
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {imdb: data.imdbRating, rt: data.Ratings[1].Value, mc: data.Ratings[2].Value, size: 3, stat: 'yes', title: title, origTitle: OrigTitle}, function(response) {});
				});
			} else {
				console.log(data.imdbRating);
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {imdb: data.imdbRating, size: 1, stat: 'yes', title: title, origTitle: OrigTitle}, function(response) {});
				});
			}
		} else {
			console.log(title);
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {title: title, origTitle: OrigTitle, stat: 'no'}, function(response) {});
			});
		}
	}
	request.send();
});

