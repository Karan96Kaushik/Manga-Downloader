const Interface = require('./interface');
const save_ch = require('./src/save_ch');

var view = new Interface;

view.on('download_ch', (link,name)=> {
    save_ch(link,name);
})