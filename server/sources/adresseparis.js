const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */

 
const parse = data => {
  const $ = cheerio.load(data);

  return $('.right-block')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name')
        .attr("title");
      const price = parseInt(
        $(element)
          .find('.content_price')
          .text()
      );

      const brand = 'adresseparis';

      return {brand, name, price};
    })
    .get();
};


function parseHomepage(data) {
  const $ = cheerio.load(data);
  return $('.cbp-spmenu')
    .map((i, element) => {
      var href= $(element)
        .find('li > ul > li > a')
        .attr('href');
      return {href};
    }).
    get()
};
/*
function parseHomepage2(data) {
  const $ = cheerio.load(data);
  return $('.cbp-spmenu')
    .find('li > ul > li > a')
    .each(function (index, element) {
      var href = $(element)
        .attr('href');
      href = ''+href;
      console.log(typeof href);
      return href;
    })
    .get()
}; */

function parseHomepage2(data) {
  const $ = cheerio.load(data);
  return $('.cbp-spmenu')
    .find('li > ul > li > a')
    .map(function (index, element) {
      var href = $(element)
        .attr('href');
      //console.log(typeof href);
      return href;
    })
    .get()
}; 



module.exports.scrapeLinks = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    console.log(typeof parseHomepage2(data))
    return parseHomepage2(data);
  }

  console.error(status);

  return null;
};



/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */


module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

