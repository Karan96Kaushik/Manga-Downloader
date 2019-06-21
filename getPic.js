const save_image = require('./save_pic');

var args = process.argv;

var im_link = args[2];   //'https://bu.mkklcdnbuv1.com/mangakakalot/o1/onepunchman/chapter_108_orochi_vs_saitama/3.jpg';
var im_name = args[3] + '.jpg';   //'im5.jpg';
var dir = __dirname + '/Downloads/' + im_name;

save_image(im_link,dir);
