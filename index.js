const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'JAa63mUYbq4GUc';

// added db name and password
const uri = "mongodb+srv://organicUser:JAa63mUYbq4GUc@cluster0.mps7w.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send('hello i am working');
    res.sendFile(__dirname + '/index.html');
});

// db connection
client.connect(err => {
    // db name and collection name
    const productCollection = client.db("organicdb").collection("products");
    // const product = { name: 'modhu', price: 25, quantity: 20};

    // read from db
    app.get("/products", (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res)=>{
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, documents)=>{
            res.send(documents[0]);
        })
    })

    // add product
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
            .then(result => {
                console.log('one product added')
                res.send('success')
            })
    })

    app.delete('/delete/:id', (req, res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id)})
            .then(result => {
                console.log(result);
            })
    })

    console.log('database connected!');
    // client.close();
});


app.listen(3000)