
const http = require('http');
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const PDFDocument = require('pdfkit');

var args = process.argv;
var continuee = true;
var allPages = [];

console.log(args);
var link_split = args[2].split('/');
var maindir;
var count = 0;

function getPic(page_link) {

	const tempfile = fs.createWriteStream("temp.jpg");

	const request = http.get(page_link, function (response) {

		response.pipe(tempfile);

		response.on('end', () => {

			fs.readFile('./temp.jpg', function (err, buf) {
				var configsFile = buf.toString();

				var root = HTMLParser.parse(configsFile);
				try {
					var image_link = (root.querySelector('.attachment-image').childNodes[0].rawAttrs).split('"')[1];
					var next_link = (root.querySelector('.next-link').childNodes[0].rawAttrs).split("'")[1];

					console.log(image_link);
					//console.log(next_link);
				} catch (err) {
					continuee = false;
					console.log('Err');

				}

				const img_request = http.get(image_link, function (img_response) {
					count = count + 1;
					//console.log('Saving');http://www.porncomix.info/jab-comixxx-dna/dna_18/

					var dir = __dirname + '/' + link_split[link_split.length - 3] + '/';
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir, 0744);
					}

					maindir = dir;
					var fileName = count + image_link.split('/').pop();
					//console.log(dir);

					allPages.push(dir + fileName);
					const file = fs.createWriteStream(dir + fileName);

					img_response.pipe(file);

					if (continuee) {
						//count++;
						getPic(next_link);
					}
					else {
						makeDoc();
					}

				});

			});

		});


	});
}

function makeDoc() {
	//allPages.pop();
	//console.log(allPages);

	doc = new PDFDocument

	//Pipe its output somewhere, like to a file or HTTP response 
	//See below for browser usage 
	console.log(link_split);
	console.log('OP PDF ', maindir + '/' + link_split[link_split.length - 3] + '.pdf');

	doc.pipe(fs.createWriteStream(maindir + link_split[link_split.length - 3]  + '.pdf'))

	//Add an image, constrain it to a given size, and center it vertically and horizontally 
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



	/*
	doc.addPage()
	   .image('./1.png', {
	   fit: [500,400],
	   align: 'center',
	   valign: 'center'
	});
	*/

	doc.end();
}

getPic(args[2]);
//getPic(args[2]);