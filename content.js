var begin = 3;
function getRatings(start) {
	let movies = document.getElementsByClassName('ptrack-content');

	for (var i = start; i < movies.length; i++) {
		chrome.runtime.sendMessage({title: movies[i].innerText}, function(response) {});
	}

	if (start <= movies.length) {
		chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.stat == 'yes') {
				if (request.size == 1) {
					for (var i = start; i < movies.length; i++) {
						if (movies[i].innerText == request.origTitle && !movies[i].textContent.includes(request.imdb)) {
							var rating = document.createElement("div");
							var newText = document.createTextNode(request.imdb);
							rating.appendChild(newText);
							rating.setAttribute("id", "rating");
							movies[i].appendChild(rating);
						}
					}
				} else if (request.size == 3) {
					for (var i = start; i < movies.length; i++) {
						if (movies[i].innerText == request.origTitle && !movies[i].textContent.includes(request.imdb)) {
							var rating = document.createTextNode(request.imdb);
							movies[i].appendChild(rating);
						}
					}
				}
			} else if (request.stat == 'no') {
				console.log("FAILED: " + request.title);
			}
		});
	}
	begin = movies.length;
}

window.onload = getRatings(begin);
console.log("Hello");
window.addEventListener("click", function() {setTimeout(function(){getRatings(3)}, 1000)});
window.addEventListener("scroll", function() {getRatings(begin)});
