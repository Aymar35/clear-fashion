const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db =require('./db/index.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async(request, response) => {
	console.log(request.meta);
	limit = request.query.limit;
	brand = request.query.brand;
	price =parseInt(request.query.price);
	console.log(brand, limit, price);

	products = await db.find({ brand : brand , price:{$lte:price}})
	if(products.length>0)
	{
		let prod_limit=[]
		for(var i = 0; i<limit; i++)
		{
			if(i<products.length)
			{
				prod_limit.push(products[i])
			}
		}
		console.log(products);
		response.send(prod_limit);
	}
	else
	{
		response.send({'ack': "products not find"});
	}
})

app.get('/products/:id', async(request, response) => {
	id=request.params.id;
	res=await db.find({ _id : `ObjectId("${id}")` });
	if(res.length>0)
	{
		console.log(res);
		response.send(res);
	}
	else
	{
		console.log("ID not found");
		response.send({"res":"id is not found"});
	}
})

app.get('/products', async(request, response) => {
	let page = parseInt(request.query.page);
  	let size = parseInt(request.query.size);
  	let debut = parseInt((page-1)*size);

	const res=await db.find({});

	try {

		let prod =[];
		if(page==null && size==null)
		{
			//console.log(res);
			prod=res;
		}
		else
		{
			for(i=debut; i< debut+size;i++){

				if(res[i] != null){
	 				prod.push(res[i]);
	 			}
	 		}
		}

		response.send({"page" : true, "meta" : {"currentPage":page, "pageSize":size, "pageCount":prod.length, "count":res.length}, "data": {"result":prod}});
	}catch(e){
		response.send(e);
	}
})

app.listen(PORT);
//db.getDB()
console.log(`📡 Running on port ${PORT}`);