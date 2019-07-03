const http = require('http');
const https = require('https');
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const PDFDocument = require('pdfkit');

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

			console.log(configsFile)

			var root = HTMLParser.parse(configsFile);
			try {
				var _images = root.querySelectorAll('.owl-lazy');
				no_of_images = _images.length;

				_images.map((e, i) => {
					print_page(e, i)
				})
			} catch (err) {
				console.log('Err ', err);
			}
		});
	});
})



function print_page(e, i) {
	var im_link = (e.rawAttrs.split('data-src="')[1]).split('"')[0];
	var im_name = parseInt((im_link.split('/').pop()).split('.jpg'));

	if (im_name < 10) {
		im_name = '00' + im_name;
	} else if (im_name < 100) {
		im_name = '0' + im_name;
	} else {
		im_name = '' + im_name;

	}

	console.log('started for ', im_link)
	var link_split = im_link.split('/');
	var folder_name = link_split[link_split.length - 2];

	//console.log(folder_name)

	var local_dir = __dirname + "/Downloads/OPM/";
	directory = local_dir;
	name = folder_name;

	if (!fs.existsSync(local_dir)) {
		fs.mkdirSync(local_dir, 0744);
	}

	var dir = local_dir + folder_name + '/';

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, 0744);
	}

	im_name = im_name + '.jpg';

	var tempfile = fs.createWriteStream(dir + im_name);

	//console.log(im_name);
	try {
		var request1 = https.get(im_link, function (response1) {
			response1.pipe(tempfile);

			response1.on('end', () => {
				console.log('Saved ' + im_name);
				allPages.push(dir + im_name);

				if (allPages.length == no_of_images) {
					console.log('All Done')
					makeDoc();

				}

			});
			response1.on('error', () => {
				console.log('ERRRRRRRRRRRRR')
			})
		});
	} catch (err) {
		console.log('EEERRR', im_link, im_name);
	}
}




function makeDoc() {
	allPages.sort();

	//console.log(allPages)

	var doc = new PDFDocument
	//console.log(link_split);
	//console.log('OP PDF ', directory + '/' + name + '.pdf');

	doc.pipe(fs.createWriteStream(directory + '/' + name + '.pdf'))

	allPages.forEach(element => {

		console.log(element + '')
		try {
			doc.image(element + '', {
				fit: [1400, 780],
				align: 'left',
				valign: 'top'
			});

			doc.addPage({
				margins: {
					top: 5,
					bottom: 5,
					left: 5,
					right: 5
				}
			})
				.fillColor("black")
		}
		catch (e) {
			console.log('EEEEERRRR', 'e');
		}
	});
	doc.end();
}
