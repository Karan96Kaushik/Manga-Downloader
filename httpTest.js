
const http = require('http');
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const PDFDocument = require('pdfkit');

var args = process.argv;
var continuee = true;
var allPages = [];

var maindir;
var count = 0;

function getPic(page_link) {

	console.log(page_link);
	
	const tempfile = fs.createWriteStream("temp.jpg");

	const request = http.get(page_link, function (response) {
        console.log(response);


	});
}

getPic('http://www.porncomix.info/guillotine-ghouls-lord-snot/lord-snot-guillotine-ghouls-1/');
