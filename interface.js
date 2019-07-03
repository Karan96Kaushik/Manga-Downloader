const express = require('express')
const expr = express()
const bodyParser = require('body-parser');	// HTTP Request Parser
const ip = require('ip');	// To Capture the LAN IP
const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const { fork } = require('child_process');
const util = require('util');
const { app, BrowserWindow, dialog } = require('electron');
const https = require('https');
const http = require('http');
const HTMLParser = require('node-html-parser');

util.inherits(Backend, EventEmitter);

var webaddr = ip.address(); // local ip address
var port = 9696;

expr.use(bodyParser.urlencoded({ extended: false }));
expr.use(bodyParser.json());
expr.use(express.static('public'));	// Public Folder in Local Directory

expr.set('view engine', 'pug');

function Backend() {
	var self = this;
	var mainWindow;

	app.on('ready', () => {	// Display UI Window
		mainWindow = new BrowserWindow({
			height: 400,
			width: 500,
			'webPreferences': {
				'webSecurity': false
			},
			icon: __dirname + '/public/icon.png'
		});

		mainWindow.on('closed', () => {
			mainWindow = null;
			process.exit();
		});

		expr.get('/', function (req, res) {
			res.sendFile(__dirname + '/index.html');
		});

		expr.get('/chapters:id', function (req, res) {

			var manga_id = (req.params.id).split('&')[0];
			var manga_name = (req.params.id).split('&')[1];

			var link = `http://mangaowl.com/single/${manga_id}/${manga_name}`;

			http.get(link, function (response) {
				//response.pipe(tempfile);
				var rawData = '';

				response.on('data', (chunk) => {
					//console.log(chunk);
					rawData += chunk;
				});

				response.on('end', () => {	//chapter_list
					var root = HTMLParser.parse(rawData);
					var _chs = root.querySelectorAll('.chapter_list');

					var manga_name = root.querySelector('.lozad').rawAttrs.split('title="')[1].split('"')[0];

					console.log(manga_name);

					var res_json = [];

					_chs.map((e, i) => {
						var ch_name = e.childNodes[1].childNodes[0].rawText.trim();
						var ch_link = e.childNodes[1].rawAttrs.split('href="')[1].split('"')[0];

						res_json.unshift({
							'name': ch_name,
							'link': ch_link
						})

						if (i == (_chs.length - 1)) {
							//console.log(res_json);
							res_json.unshift({ manga_name });
							res.json(res_json);
						}
					})
				});
			})
		});

		expr.post('/getch', function (req, res) {
			let link = req.body.link;
			let manga_name = req.body.manga_name;

			self.emit('download_ch', link, manga_name)
			res.send('');

		});

		expr.get('/home', function (req, res) {
			res.render('home', {
				dlIP: global.statvar.dl_address,
				dlPORT: global.statvar.dl_port,
				myIP: webaddr
			});
		});

		expr.post('/home', function (req, res) {
			let action = req.body.action;

			if (req.body.action === 'exportmessageupdate' || req.body.action === 'messageupdate' || req.body.action === 'export_dir' || req.body.action === 'database_test' || req.body.action === 'database_config') {
				self.emit(action, req.body, res)
			} else {
				self.emit(action, req.body, res)
				res.send('');
			}
		});

		webaddr = 'localhost';

		expr.listen(port, webaddr, (e) => {          // Start running backend server
			console.log(`App listening on port http://${webaddr}:${port} !`)
			mainWindow.loadURL(`http://${webaddr}:${port}/`);	// Serial Initialisation Screen
		});
	});
};

function gett() {
	var page_link = 'https://mangaowl.com/live_search/gosu';
	https.get(page_link, function (response) {
		var rawData = '';
		response.on('data', (chunk) => {
			console.log(chunk);
			rawData += chunk;
		});
		response.on('end', () => {
			console.log(rawData);
		});
	})
}

//Backend();
module.exports = Backend;