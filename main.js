#!/usr/bin/env node

// Downloads images from reddit. Either enter in URL or by subreddit.
// Should be able to skip some and/or pull a certain limit.
// Save the last one's id so you can scrape past that one later.
var http = require('http'),
    sys = require('sys')
    Crawler = require('crawler'),
		url = require('url'),
		cheerio = require('cheerio'),
		c = require('commander'),
		request = require('request'),
		fs = require('fs'),
		mkdirp = require('mkdirp');

var reddit = 'http://reddit.com/r/';

c
	.version('0.0.1')
	.command('scrape <url> <destination>')
	.action(function(url, destination){
		scrapeURL(url, destination, 1);
	})
	.command('scrape <subreddit> <destination> <count>')
	.action(function(subreddit, destination, count){
		scrapeURL(subreddit, destination, count);
	});

c.parse(process.argv);

function downloadImage(uri, destination, callback){
	request.head(uri, function(err, res, body){
		if(res){
	    request(uri).pipe(fs.createWriteStream(destination)).on('close', callback);
  	}
  });
}

var cookieJar = request.jar();
var h = "ll";

function scrapeURL(url, destination, count){
	mkdirp('./' + destination, function(err){
		url = (url.indexOf('http') == -1) ? reddit + url : url;
		var options = {}; 
		options.url = url;
		request(options, function(error, response, body){
			$ = cheerio.load(body);
			$('a.title.may-blank').each(function(index, item){
				var imglocation = $(item).attr('href');
				var filename = imglocation.split('/').slice(-1).pop();
				if(filename.indexOf('.jpg') != -1 || filename.indexOf('.gif') != -1){
					downloadImage(imglocation, destination + '/' + filename, function(){
						console.log('downloaded: ' + filename);
						if(index == 25 && count > 1) {
							scrapeURL(url, destination, count - 1);
						}
					});
				}
			})
		});
	});
}

// var c = new Crawler({
// 	maxConnections: 5,
// 	callback: function(error, result, $){
// 		$('a.title.may-blank').each(function(index, a){
// 			// get each image and save it in designated directory.	
// 		});
// 	}
// });





