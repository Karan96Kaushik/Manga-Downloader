const http = require('http');
const https = require('https');
const fs = require('fs');

function save_pic(im_link, abs_file_name) {		// Note: abs_file_name = _dirname + file_name
	return new Promise(function (resolve, reject) {
		https.get(im_link, function (response) {
			var tempfile = fs.createWriteStream(abs_file_name);
			
			try {
				response.pipe(tempfile);
			} catch (e) {
				console.log('Save Error!!' + e);
				reject();
			}

			response.on('end', () => {
				console.log('Saved ' + abs_file_name);
				resolve(abs_file_name);
			});
		});
	})
}

module.exports = save_pic