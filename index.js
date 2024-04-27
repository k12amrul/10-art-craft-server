const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
console.log(process.env.DB_USER)
console.log(process.env.DB_PAS)

// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PAS}@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://test-server:test-server123@cluster0.uftqkre.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("artDB");
    const artsCollection = database.collection("arts");

    // app.get('/users', async (req, res) => {
    //   const cursor = artCollection.find()
    //   const result = await cursor.toArray()
    //   res.send(result)

    // }
    // )

    app.get('/arts', async (req, res) => {
      const query =  artsCollection.find()
      const result = await query.toArray()
      res.send(result)


    })

app.post( '/addCraftItem' , async(req ,res )=>{

  const   newCrftItem= req.body
  console.log(newCrftItem)

  const result = await  artsCollection.insertOne( newCrftItem)
  res.send( result)

})


    app.get('/', (req, res) => {

      console.log(res.send("a-10 server "))
      res.send(" a-10 server  ")
    })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
