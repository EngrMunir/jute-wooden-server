const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.niwwhqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const userCollection = client.db('juteDB').collection('user');
    const craftCollection = client.db('juteDB').collection('craft');
    const categoryCollection = client.db('juteDB').collection('mainCategory');

    // mainCategory related api
    app.get('/category', async(req, res) =>{
      const cursor = categoryCollection.find();
      const category = await cursor.toArray();
      res.send(category);
    })

    // craft subCategory related api
    app.get('/craft', async(req, res)=>{
      const cursor = craftCollection.find();
      const crafts = await cursor.toArray();
      res.send(crafts);
    })

    // delete operation
    app.delete('/craft/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/craft/:email', async(req, res) =>{
      const email = req.params.email;
      const query = { user_email: email };
      // console.log(email)
      const result = await craftCollection.find(query).toArray();
      // console.log(result)
      res.send(result)
    })
    app.get('/craft/sub/cat/:subcategory_Name', async(req, res) =>{
      const subcategory_Name = req.params.subcategory_Name;
      const query = { subcategory_Name: subcategory_Name };
      console.log(subcategory_Name)
      const result = await craftCollection.find(query).toArray();
      console.log(result)
      res.send(result)
    })

    app.post('/craft', async(req, res) =>{
        const craft = req.body;
        const result = await craftCollection.insertOne(craft);
        res.send(result);
      })
  


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('jute wooden server is running')
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`)
})