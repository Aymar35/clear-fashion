const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-meta')
    .map((i, element) => {
      const name = $(element)
        .find('.product-title')
        .text()
        .trim();
      const price = parseInt(
        $(element)
          .find('.product-prices')
          .text()
          .replace(/Lease for €[0-9]+,[0-9]+/,'')
          .replace(/buy/i, '')
          .replace(/\n/g,'')
          .replace(/€/g,'')
      );
      const brand = 'mudjeans';

      return {brand, name, price};
    })
    .get();
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
