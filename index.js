const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkst0.mongodb.net/${process.env.DB_STORE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const collection = client.db(`${process.env.DB_STORE}`).collection("Products");
    const ordersCollection = client.db(`${process.env.DB_STORE}`).collection("Orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body
        collection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.get('/products/:key', (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        collection.find({ key: { $in: productKeys } })
            .toArray((err, document) => {
                res.send(document)
            })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })








    console.log('database connect')
});











app.get('/', (req, res) => {
    res.send('hello world')
})
console.log(process.env.DB_USER)


app.listen(process.env.PORT || 5000)



