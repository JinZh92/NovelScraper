import cheerio from 'cheerio';
import request from 'request';
import iconv from 'iconv-lite';
import rs from 'request-promise';

const searchConfig = {
    '530p': {
        name:   '530p',
        url:    'http://www.530p.com/s/',
        encode: 'GBK'
    }
}

let searchTerm = '猫腻';

function SearchTerm(term, {name, url, encode}) {
    console.log("============= Searching =============");
    let finalURL = url + encodeURIComponent(term);
    console.log(`Running request on ${finalURL}......`);
    requestContent('search', name, finalURL, encode);
}

function requestContent(type, site, url, encode) {
    request({
        uri: url,
        encoding: null
    }, (err, res, html) => {
        console.log("============= Response received =============");
        if (err) {
            console.log('Something went wrong - check the internet connection or your request.')
        } else {
            let decodedHTML = iconv.decode(html, encode);
            // console.log(decodedHTML);
            // Parse the HTML based on specific site and request type
            if (type === 'search') {
                ParseResult(site, decodedHTML);
            }
        }
    })
}

function ParseResult(site, html) {
    let $ = cheerio.load(html);
    if (site === '530p') {
        let resultList = [];
        let resultbody = $('.conter > ul').each(function(index){
            if (index !== 0) {
                let title = $(this).children('.conter1').text();
                let bookLink = $(this).children('.conter1').children('a').attr('href');
                let newestChapter = $(this).children('.conter2').text();
                let ncLink = $(this).children('.conter2').children('a').attr('href');
                let author =  $(this).children('.conter4').text();
                let lastUpdated =  $(this).children('.conter3').text();
                resultList.push({ title, bookLink, newestChapter, ncLink, author, lastUpdated });
            }
        });
        console.log('search result:', resultList)
        return resultList;
    }
}

function getContentTable(site, bookURL) {
    
}


SearchTerm(searchTerm, searchConfig['530p']);