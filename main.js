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

c
	.version('0.0.1')
	.command('scrape <url> <destination>')
	.action(function(url, destination){
		scrapeURL(url, destination)
	})
	.command('scrape <subreddit> <count>')
	.action(function(subreddit, count){

	});

c.parse(process.argv);

function downloadImage(uri, destination, callback){
	request.head(uri, function(err, res, body){
		if(res){
	    request(uri).pipe(fs.createWriteStream(destination)).on('close', callback);
  	}
  });
}

function scrapeURL(url, destination){
	mkdirp('./' + destination, function(err){
		request(url, function(error, response, body){
			$ = cheerio.load(body);

			$('a.title.may-blank').each(function(index, item){
				var imglocation = $(item).attr('href');
				var filename = imglocation.split('/').slice(-1).pop();
				if(filename.indexOf('.jpg') != -1){
					downloadImage(imglocation, destination + '/' + filename, function(){
						console.log('downloaded: ' + filename);
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





