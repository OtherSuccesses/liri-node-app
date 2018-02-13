var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var keys= require("./keys.js");
var fs = require("fs");
var arg = process.argv;

var tweets = function(){
	var client = new twitter ({
		consumer_key: keys.consumer_key,
		consumer_secret: keys.consumer_secret,
		access_token_key: keys.access_token_key,
		access_token_secret: keys.access_token_secret
	});


	client.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=@vrthrow&count=3', function(error, tweets, response) {
		if(error) throw error;
		for(var i = 0; i<tweets.length; i++) {
			console.log(tweets[i].text,  tweets[i].created_at);
		}
	});
};


var songData = function(data){
	var client = new spotify({
		id: "05e915f7cd7b454d98b84a2f46e19192",
		secret: "507d2405d443468ea590b28a19b84aa5"
	});

	if (data == undefined){
		data = "I saw the sign";
	}

	client.search({type:"track", query: data}, function(songStats, error){
		if (error){
			throw error;
		}
		else{
			var items = songStats.tracks.items;
			console.log("Song name: " + items[0].name);
			console.log("Artist: " + items[0].album.artists[0].name);
			console.log("Album: " + items[0].album.name);
			console.log("URL: " + items[0].preview_url);
		}
	});

};

var movieData = function(data){

	if (data == undefined){
		data = "Mr Nobody";
	}

	var queryUrl = "http://www.omdbapi.com/?t=" + data + "&y=&plot=short&tomatoes=true&apikey=40e9cece";

	request(queryUrl, function(error, response, body){
		if (error){
			throw error;
		}
		else{
			var json = JSON.parse(body);

			console.log("Title: " + json.Title);
			console.log("Year: " + json.Year);
			console.log("Plot: " + json.Plot);
			console.log("Starring: " + json.Actors);
			console.log("Rated: " + json.Rated);
			console.log("Country: " + json.Country);
			console.log("Language: " + json.Language);
			consumer_secretole.log("IMDB Rating: " + json.imdbRating);
			console.log("Rotton Tomatoes URL: " + json.tomatoURL);
		}
	})
};

var whatItSays = function(){
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if ( error ){
			throw error;
		}
		var dataFormat = data.split(",");
		songData(dataFormat[1],dataFormat[2]);
	});
};

var start = function(operation, data){
	switch (operation){
		case "my-tweets":
			tweets();
			break;
		case "spotify-this-song":
			songData(data);
			break;
		case "movie-this":
			movieData(data);
			break;
		case "do-what-it-says":
			whatItSays();
			break;
		default:
			console.log("Unknown command.");
			console.log("Please try: my-tweets, spotify-this-song, movie-this, do-what-it-says");
	}
};

start(arg[2], arg[3]);