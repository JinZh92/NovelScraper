'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    '530p': {
        name: '530p',
        searchURL: 'http://www.530p.com/s/',
        tableURL: 'http://www.530p.com',
        encode: 'GBK'
    }
};

var searchTerm = '猫腻';

function SearchTerm(term, _ref) {
    var name = _ref.name,
        searchURL = _ref.searchURL,
        encode = _ref.encode;

    console.log("============= Searching =============");
    var finalURL = searchURL + encodeURIComponent(term);
    console.log('Running request on ' + finalURL + '......');
    requestContent('search', name, finalURL, encode);
}

function requestContent(type, site, url, encode) {
    var requestConfig = {
        uri: url,
        encoding: null
    };
    (0, _requestPromiseNative2.default)(requestConfig).then(function (html) {
        console.log("============= Response received =============");
        var decodedHTML = _iconvLite2.default.decode(html, encode);
        console.log(decodedHTML);
        // Parse the HTML based on specific site and request type
        if (type === 'search') {
            ParseResult(site, decodedHTML);
        }
        if (type === 'content') {
            return decodedHTML;
        }
    }).catch(function (err) {
        console.log('Something went wrong - check the internet connection or your request.');
    });
}

function ParseResult(site, html) {
    var $ = _cheerio2.default.load(html);
    if (site === '530p') {
        var resultList = [];
        var resultbody = $('.conter > ul').each(function (index) {
            if (index !== 0) {
                var title = $(this).children('.conter1').text();
                var bookLink = $(this).children('.conter1').children('a').attr('href');
                var newestChapter = $(this).children('.conter2').text();
                var ncLink = $(this).children('.conter2').children('a').attr('href');
                var author = $(this).children('.conter4').text();
                var lastUpdated = $(this).children('.conter3').text();

                bookLink = config['530p'].tableURL + bookLink;
                ncLink = config['530p'].tableURL + ncLink;
                resultList.push({ title: title, bookLink: bookLink, newestChapter: newestChapter, ncLink: ncLink, author: author, lastUpdated: lastUpdated });
            }
        });
        console.log('search result:', resultList);
        return resultList;
    }
}

function getContentTable(site, bookURL) {
    if (Object.keys(config).includes(site)) {
        console.log("Site name is included in the config.");
    } else {
        console.log("Site name is NOT included in the config.");
    }
    var tableEncode = config[site].encode;
    var tableHTML = requestContent('content', site, bookURL, tableEncode);
    console.log("========== Table HTML ==========", tableHTML);
}

SearchTerm(searchTerm, config['530p']);
// .then(booklist => {
//     console.log('The Book\'s link is:', booklist[0]);
// })
// .catch(err => {
//     console.log('error occured')
// });