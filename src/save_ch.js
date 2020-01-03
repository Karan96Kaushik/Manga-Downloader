const http = require('http');
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const HTMLParser = require('node-html-parser');
const save_image = require('./save_pic');
const imagesToPdf = require("images-to-pdf")

function download_chapter(link, manga_name) {
    return new Promise(function (resolve, reject) {
        var allPages = [];
        var no_of_images = 0;
        var directory;
        var name;

        console.log('Downloading ch', link)

        axios.get(link)
            .then((response) => {
                var configsFile = response.data.toString();
                var root = HTMLParser.parse(configsFile);
                try {
                    var _images = root.querySelectorAll('.owl-lazy');
                    no_of_images = _images.length;

                    var count = 0;
                    function start() {
                        print_page(_images[count]).then(() => {
                            count += 1;
                            start(count);
                        });
                    }
                    start(count)

                } catch (err) {
                    console.log('Err ', err);
                }
            })

        function print_page(e) {
            return new Promise(function (resolve, reject) {

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

                var local_dir = __dirname + "/Downloads/" + manga_name + '/';

                directory = local_dir;
                name = folder_name;


                if (!fs.existsSync(local_dir)) {
                    fs.mkdirSync(local_dir, 0744);
                }

                var dir = local_dir + folder_name + '/';

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, 0744);
                }

                save_image(im_link, dir + im_name)
                    .then(() => {
                        console.log('Saved ' + im_name)

                        allPages.push(dir + im_name);

                        if (allPages.length == no_of_images) {
                            console.log('All Done')
                            makeDoc();
                        }

                        resolve();

                    }, () => {
                        console.log('Not Saved ' + im_name)
                    })
            })
        }

        function makeDoc() {
            allPages.sort();
            console.log(allPages)
            imagesToPdf(allPages, directory + "/" + name + '.pdf')
        }
    })
}

module.exports = download_chapter;