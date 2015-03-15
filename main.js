// Downloads images from reddit. Either enter in URL or by subreddit.
// Should be able to skip some and/or pull a certain limit.
// Save the last one's id so you can scrape past that one later.
var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys')
    c = require('crawler'),
		url = require('url');

