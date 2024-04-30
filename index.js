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
    const categoryCollection = database.collection("categoriese");

    // app.get('/users', async (req, res) => {
    //   const cursor = artCollection.find()
    //   const result = await cursor.toArray()
    //   res.send(result)

    // }
    // )

    app.get('/', async (req, res) => {
      const query = categoryCollection.find().limit(6)
      const result = await query.toArray()
      res.send(result)


    })
    app.get('/arts', async (req, res) => {
      const query = artsCollection.find()//.limit(6)
      const result = await query.toArray()
      res.send(result)

    })

    app.get('/arts/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) } // artsCollection.findOne()
      const result = await artsCollection.findOne(query) //.toArray()
      res.send(result)


    })

    app.get('/myArtCraft/:email', async (req, res) => {


      const email = req.params.email;
      // console.log(email)
      const query = { user_email: email };
      const result = await artsCollection.find(query).toArray()

      res.send(result)


    })



    //   app.get('/myArtCraft', async (req, res) => {
    //     // console.log(req.query )
    //     let query = {}
    //     if (req.query.email) {
    //         query = {
    //             email: req.query.email
    //         }

    //     }
    //     const cursor = artsCollection.find(query)
    //     const result = await cursor.toArray()
    //     res.send(result)
    // })


    app.post('/addCraftItem', async (req, res) => {

      const newCrftItem = req.body
      console.log(newCrftItem)

      const result = await artsCollection.insertOne(newCrftItem)
      res.send(result)

    })

    app.put('/art/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updatedItem = req.body
      const options = { upsert: true }
      const artItem = {
        $set: {
          // name: updatedItem.name,
          // name: updatedItem.name,
          subcategory_Name: updatedItem.subcategory_Name,
          item_name: updatedItem.item_name,
          customization: updatedItem.customization,
           description: updatedItem.description,
          imageURL: updatedItem.imageURL,
          price: updatedItem.price,
          rating: updatedItem.rating,
         processing_time : updatedItem.processing_time,
          stockStatus: updatedItem.stockStatus,
          discount: updatedItem.discount,
         user_email : updatedItem.user_email,
         user_name : updatedItem.user_name,
          
        
       
        }
      }
      const result = await artsCollection.updateOne(filter, artItem, options)
      res.send(result)


    })


    app.delete("/arts/:id", async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }

      const result =await  artsCollection.deleteOne(query)
      res.send(result)


    })


    

    // app.get('/', (req, res) => {

    //   console.log(res.send("a-10 server "))
    //   res.send(" a-10 server  ")
    // })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
