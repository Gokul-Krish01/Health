const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'medicine_chatbot';
let db;

async function connectDB() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log('Connected successfully to database');
}

connectDB();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/disease/:name', async (req, res) => {
    const diseaseName = req.params.name.toLowerCase();
    const collection = db.collection('diseases');
    const disease = await collection.findOne({ disease_name: diseaseName });
    if (disease) {
        res.json(disease);
    } else {
        res.status(404).json({ message: 'Disease not found' });
    }
});

app.get('/diseases', async (req, res) => {
    const collection = db.collection('diseases');
    const diseases = await collection.find({}).project({ disease_name: 1, _id: 0 }).toArray();
    res.json(diseases.map(d => d.disease_name));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
