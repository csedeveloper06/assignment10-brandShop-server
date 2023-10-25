const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require("express/lib/response");
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



console.log(process.env.DB_USER);
console.log(process.env.DB_pass);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwzzltb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db('brandsDB').collection('brands');

    const newBrands = [
      {name:'Cocacola', image: 'https://i.ibb.co/pdc0BXb/brand3.png'},
      {name:'Nestle', image: 'https://i.ibb.co/7QM5gFp/nestle.jpg'},
      {name:'McDonald', image: 'https://i.ibb.co/1721pWG/mcdonald.png'},
      {name:'Starbucks', image: 'https://i.ibb.co/NFZgkLb/starbuck.png'},
      {name:'PepSico', image: 'https://i.ibb.co/y5YrZZk/pepsico.png'},
      {name:'Kelloggs', image: 'https://i.ibb.co/DYv8Wzs/kellog-s.png'}
  ];

    app.get('/brands', async( req,res ) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post('/brands', async(req,res) =>{
      const newBrands = req.body;
      console.log(newBrands);
      const result = await brandsCollection.insertMany(newBrands);
      res.send(result);
  })



    const productsCollection = client.db('productsDB').collection('products');
    const usersCollection = client.db('productsDB').collection('user');
    const cartsCollection = client.db('productsDB').collection('carts');


    app.get('/products', async(req,res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/carts', async(req,res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/products/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    })


    app.post('/products', async(req,res) =>{
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);
    })

    app.put('/products/:id', async(req,res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};
        const updatedProduct = req.body;
        const product = {
          $set: {
            photo: updatedProduct.photo,
            name: updatedProduct.name,
            brand: updatedProduct.brand,
            type: updatedProduct.type,
            price: updatedProduct.price,
            description: updatedProduct.description,
            rating: updatedProduct.rating
          }
        }

        const result = await productsCollection.updateOne(filter,product,options);
        res.send(result);
    })


    // user related API
     
    app.post('/user', async( req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // cart related API

    app.post('/carts', async(req,res) =>{
      const newCartProduct = req.body;
      console.log(newCartProduct);
      const result = await cartsCollection.insertOne(newCartProduct);
      res.send(result);
  })

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('FOoDiE is running on server');
})

app.listen(port, () => {
    console.log(`FOodiE server is running on port : ${port}`);
})