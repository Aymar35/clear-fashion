const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb+srv://aymar:aymar@clearfashion.9mbbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const MONGODB_DB_NAME = 'clearfashion';
async function run() {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true},{ 'useUnifiedTopology': true });
  const db =  client.db(MONGODB_DB_NAME);
  console.log('connected');

  const products = [];
  console.log(products);
  
  const collection = db.collection('products');
  const result = collection.insertMany(products);
  console.log(result);
}

//run().catch(console.dir);