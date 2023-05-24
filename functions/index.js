const functions = require('firebase-functions');

const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

//config
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a Firestore instance
const db = admin.firestore();

//Main App
const app = express();
app.use(cors({ origin: true }));

//routes

// test routes
app.get('/', (req, res) => {
  return res.status(200).send('Hi there');
});

// creat a new table in the table collection
app.post('/api/tables', async (req, res) => {
  try {
    const { name, columns, rows } = req.body;

    // Add a new document to the 'tables' collection with an automatically generated ID
    const docRef = await db.collection('tables').add({
      name,
      columns,
      rows,
    });

    const newTable = {
      id: docRef.id,
      name,
      columns,
      rows,
    };

    res.status(201).json(newTable);
  } catch (error) {
    console.error('Error while creating table:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get single table
app.get('/api/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Retrieve the table document from Firestore
    const tableDoc = await db.collection('tables').doc(id).get();

    if (!tableDoc.exists) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Extract the table data from the document
    const tableData = tableDoc.data();

    res.json(tableData);
  } catch (error) {
    console.error('Error while fetching table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update a table
app.put('/api/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, columns, rows } = req.body;

    // Check if the table with the provided ID exists
    const docRef = db.collection('tables').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Update the document with the new data
    await docRef.update({
      name,
      columns,
      rows,
    });

    const updatedTable = {
      id,
      name,
      columns,
      rows,
    };

    res.json(updatedTable);
  } catch (error) {
    console.error('Error while updating table:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete a table
app.delete('/api/tables/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the table with the provided ID exists
    const docRef = db.collection('tables').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Delete the document
    await docRef.delete();

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error while deleting table:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//get all the tables
app.get('/api/tables', async (req, res) => {
  try {
    // Fetch all documents from the 'tables' collection
    const snapshot = await db.collection('tables').get();

    // Map the document data to an array of tables
    const tables = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        columns: data.columns,
        rows: data.rows,
      };
    });

    res.json(tables);
  } catch (error) {
    console.error('Error while fetching tables:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//axport the API to firebase cloud functions
exports.app = functions.https.onRequest(app);
