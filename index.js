const Interface = require('./interface');
const save_ch = require('./download_chapter');

var view = new Interface;

view.on('download_ch', (link,name)=> {
    save_ch(link,name);
})