import cheerio from 'cheerio';
import request from 'request';
import iconv from 'iconv-lite';
import rp from 'request-promise-native';

const config = {
    '530p': {
        name:       '530p',
        searchURL:  'http://www.530p.com/s/',
        tableURL:   'http://www.530p.com',
        encode:     'GBK'
    }
}

let searchTerm = '猫腻';

function SearchTerm(term, {name, searchURL, encode}) {
    console.log("============= Searching =============");
    let finalURL = searchURL + encodeURIComponent(term);
    console.log(`Running request on ${finalURL}......`);
    requestContent('search', name, finalURL, encode);
}

function requestContent(type, site, url, encode) {
    let requestConfig = {
        uri: url,
        encoding: null
    };
    rp(requestConfig)
        .then(html => {
            console.log("============= Response received ============="); 
            let decodedHTML = iconv.decode(html, encode);
            console.log(decodedHTML);
            // Parse the HTML based on specific site and request type
            if (type === 'search') {
                ParseResult(site, decodedHTML);
            }
            if (type === 'content') {
                return decodedHTML;
            }
        })
        .catch(err => {
            console.log('Something went wrong - check the internet connection or your request.')
        });
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

                bookLink = config['530p'].tableURL + bookLink;
                ncLink = config['530p'].tableURL + ncLink;
                resultList.push({ title, bookLink, newestChapter, ncLink, author, lastUpdated });
            }
        });
        console.log('search result:', resultList)
        return resultList;
    }
}

function getContentTable(site, bookURL) {
    if (Object.keys(config).includes(site)) {
        console.log("Site name is included in the config.");
    } else {
        console.log("Site name is NOT included in the config.");        
    }
    let tableEncode = config[site].encode;
    let tableHTML = requestContent('content', site, bookURL, tableEncode);
    console.log("========== Table HTML ==========", tableHTML);
}


SearchTerm(searchTerm, config['530p']);
    // .then(booklist => {
    //     console.log('The Book\'s link is:', booklist[0]);
    // })
    // .catch(err => {
    //     console.log('error occured')
    // });

