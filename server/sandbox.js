/* eslint-disable no-console, no-process-exit */
const axios = require('axios');
const cheerio = require('cheerio');
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/mudjeans');
const adresseparis = require('./sources/adresseparis');
const { MongoClient } = require("mongodb");


async function sandboxD (eshop = 'https://www.dedicatedbrand.com/en/men') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const links = await dedicatedbrand.scrapeLinks(eshop);
    //console.log(links);
    finalproduct=[];
    //console.log(links[1].href);
    for (let i=1; i<links.length;i++){
      sublink = links[i].href;
      //console.log(sublink)
      products = await dedicatedbrand.scrape(sublink);
      for (let j=0; j<products.length;j++){
        finalproduct.push(products[j])
      }
    }
    // const products = await dedicatedbrand.scrape('https://www.dedicatedbrand.com/en/men/t-shirts');
    //console.log(finalproduct);
    console.log('Dedicated brand done');
    return finalproduct;
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

 
async function sandboxM (eshop = 'https://mudjeans.eu/collections/men'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    finalproducts = await mudjeans.scrape(eshop);
    //console.log(finalproducts);
    console.log('Mud jeans done');
    return finalproducts;
    
  } catch (e){
    console.error(e);
    process.exit(1);
  }
}


async function sandboxA (eshop = 'https://adresse.paris'){
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const links = await adresseparis.scrapeLinks(eshop);
    //console.log(links);
    //finalproducts = await mudjeans.scrape(eshop);
    //console.log(finalproducts);
    return finalproduct;
    
  } catch (e){
    console.error(e);
    process.exit(1);
  }
}

async function sandbox (){
  const [,, eshop] = process.argv;
  const products = [];
  //sandboxA(eshop);
  //products.push(await sandboxM(eshop));
  productM = await sandboxM(eshop);
  for (let j=0; j<productM.length;j++){
    products.push(productM[j])
  }
  //products.push(await sandboxD(eshop));
  productD = await sandboxD(eshop);
  for (let j=0; j<productD.length;j++){
    products.push(productD[j])
  }
  return products;
}




const MONGODB_URI = "mongodb+srv://aymar:aymar@clearfashion.9mbbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';

async function run(products) {
  //const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true });
  //const db =  client.db(MONGODB_DB_NAME);
  //console.log('connected');

  //const products = sandbox();
  
  //console.log(products);
  
  const collection = db.collection('products');
  const result = collection.insertMany(products);
  //console.log(result);
}


async function main(){
  const MONGODB_URI = "mongodb+srv://aymar:aymar@clearfashion.9mbbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const MONGODB_DB_NAME = 'clearfashion';
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true });
  const db =  client.db(MONGODB_DB_NAME);
  console.log('connected');

  const collection = db.collection('products');
  
  //const products = await sandbox();
  //console.log(products);
  //run(products);

  const b = 'mudjeans';
  const sortbrand = collection.find({brand : b}).toArray();
  console.log("Query : products by brand :");
  console.log(sortbrand);

  const p = 30;
  const lowerPrice = collection.find({ price : { $lt : p}}).toArray();
  console.log(`Query : products costing lower than ${p} € :`);
  console.log(lowerPrice);

  const sortedPrice = collection.find({$sort : { price : 1}}).toArray();
  console.log("Query : products sorted by price :");
  console.log(sortedPrice);
}
//run().catch(console.dir);
main()