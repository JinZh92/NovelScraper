'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var searchConfig = {
    '530p': {
        name: '530p',
        url: 'http://www.530p.com/s/',
        encode: 'GBK'
    }
};

var searchTerm = '猫腻';

function SearchTerm(term, _ref) {
    var name = _ref.name,
        url = _ref.url,
        encode = _ref.encode;

    console.log("============= Searching =============");
    var finalURL = url + encodeURIComponent(term);
    console.log('Running request on ' + finalURL + '......');
    requestContent('search', name, finalURL, encode);
}

function requestContent(type, site, url, encode) {
    (0, _request2.default)({
        uri: url,
        encoding: null
    }, function (err, res, html) {
        console.log("============= Response received =============");
        if (err) {
            console.log('Something went wrong - check the internet connection or your request.');
        } else {
            var decodedHTML = _iconvLite2.default.decode(html, encode);
            // console.log(decodedHTML);
            // Parse the HTML based on specific site and request type
            if (type === 'search') {
                ParseResult(site, decodedHTML);
            }
        }
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
                resultList.push({ title: title, bookLink: bookLink, newestChapter: newestChapter, ncLink: ncLink, author: author, lastUpdated: lastUpdated });
            }
        });
        console.log('search result:', resultList);
        return resultList;
    }
}

function getContentTable(site, bookURL) {}

SearchTerm(searchTerm, searchConfig['530p']);