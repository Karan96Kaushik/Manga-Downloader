const fs = require('fs');
const child_process = require('child_process');

var workerProcess = child_process.spawn('rtorrent', ['-d', '/home/pi/FTP', 'magnet:?xt=urn:btih:89599bf4dc369a3a8eca26411c5ccf922d78b486&dn=Interstellar+%282014%29+%282014%29+1080p+BrRip+x264+-+YIFY&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969']);

workerProcess.stdout.on('data', function (data) {
	console.log('stdout: ' + data);
	fs.writeFile("/test", data + '/n', function (err) {
		if (err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	});
});

workerProcess.stderr.on('data', function (data) {
	console.log('stderr: ' + data);
});

workerProcess.on('close', function (code) {
	console.log('child process exited with code ' + code);
});