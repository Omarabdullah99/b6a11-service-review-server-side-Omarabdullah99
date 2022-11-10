const express=require('express')
const jwt=require('jsonwebtoken')
const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors=require('cors')
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uxycogs.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });




async function run(){
    try{
        const serviceCollection=client.db('cooking').collection('services')
        const reviewCollection=client.db('cooking').collection('review')

        //all data read
        app.get('/services', async(req,res)=>{
            const query={};
            const cursor=serviceCollection.find(query)
            const services=await cursor.toArray()
            res.send(services)
        })
         //single service
         app.get('/services/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const service= await serviceCollection.findOne(query)
            res.send(service)
        })
        //home er data relode
        app.get('/serviceshome', async(req,res)=>{
            const query={};
            const cursor=serviceCollection.find(query).sort({_id:-1})
            const services=await cursor.limit(3).toArray()
            res.send(services)
        })
        //services post
        app.post('/services',async(req,res)=>{
            const review=req.body
            const result=await serviceCollection.insertOne(review)
            res.send(result)
        })

        //order send mongo
        app.post('/reviews',async(req,res)=>{
            const review=req.body
            const result=await reviewCollection.insertOne(review)
            res.send(result)
        })

        //all reviews read
       
        //query parameter email address match revies reaa
        app.get('/reviews', async(req, res)=>{
            
            let query = {}
            if(req.query.email){
                query ={
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)
        })
         //
         app.get('/review/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query)
            res.send(review)
        })

        app.put('/review/:id' , async(req, res) => {
            const id = req.params.id;
            const filter = {_id : ObjectId(id)};
            const details = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                    message: details.message
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser, option );
            res.send(result);
        })

        // read reviews by service id
        app.get('/reviews/:id', async(req,res)=>{
            const query=req.params.id
            // console.log(query)
            const cursor=reviewCollection.find({service:query}).sort({_id:-1})
            const reviews=await cursor.toArray()
            res.send(reviews)
        })
        
        //review delet
        app.delete('/reviews/:id', async(req,res)=>{
            const id = req.params.id;
            // console.log(id)
            const query= {_id:ObjectId(id)}
            const result= await reviewCollection.deleteOne(query)
            res.send(result)
        })

       
       

    }
    finally{

    }
}
run().catch(console.dir);




const port =process.env.port || 4001
app.get('/',(req,res)=>{
    res.send(' assignment 11  server is running ')
})



app.listen(port,()=>{
    console.log( ` nodemon server is running ${port}`)
})

//password:GzxJ8GZAqYQlJcmU username:dbuser
