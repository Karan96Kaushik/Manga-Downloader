const http = require('http');
const https = require('https');
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const PDFDocument = require('pdfkit');
const save_image = require('./save_pic');

var args = process.argv;

//console.log(args);

page_link = args[2];
var link_split = args[2].split('/');

const tempfile = fs.createWriteStream("temp.jpg");

var allPages = [];
var no_of_images;

var directory;
var name;

http.get(page_link, function (response) {
	response.pipe(tempfile);
	response.on('end', () => {
		fs.readFile('./temp.jpg', function (err, buf) {
			var configsFile = buf.toString();

			var root = HTMLParser.parse(configsFile);
			try {
				var _images = root.querySelectorAll('.owl-lazy');
				no_of_images = _images.length;

				_images.map((e, i) => {
					var im_link = (e.rawAttrs.split('data-src="')[1]).split('"')[0];
					var im_name = parseInt((im_link.split('/').pop()).split('.jpg'));
					
					var foldername = '/OPM11/';

					if (!fs.existsSync(__dirname + foldername)) {
						fs.mkdirSync(__dirname + foldername, 0744);
					}

					var abs_name = __dirname + foldername + im_name; // + '.jpg';
					

					save_image(im_link,abs_name)
					.then(()=> {
						//console.log('Didnt Download ' + im_link)
					},() => {
						console.log('Didnt Download ' + im_link)
					})
					.catch((e)=> {
						console.log('Didnt Download ' + im_link)
					})
				})
			} catch (err) {
				console.log('Err ', err);
			}
		});
	});
})
