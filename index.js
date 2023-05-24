const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to DataTables API!');
});

// GET /api/tables - Retrieve a list of existing tables
app.get('/api/tables', (req, res) => {
  const data = JSON.parse(fs.readFileSync('tables.json'));
  res.json(data.tables);
});

// GET /api/tables/:id - Retrieve the columns and rows of a specific table
app.get('/api/tables/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('tables.json'));
  const table = data.tables.find(table => table.id === parseInt(req.params.id));
  if (table) {
    res.json(table);
  } else {
    res.status(404).json({ error: 'Table not found' });
  }
});

// POST /api/tables - Create a new table
app.post('/api/tables', (req, res) => {
  const { name, columns, rows } = req.body; // Retrieve the row data from the request body
  const data = JSON.parse(fs.readFileSync('tables.json'));
  const newTable = {
    id: data.tables.length + 3,
    name,
    columns,
    rows,
  };
  data.tables.push(newTable);
  fs.writeFileSync('tables.json', JSON.stringify(data));
  res.status(201).json(newTable);
});

// DELETE /api/tables/:id - Delete a specific table
app.delete('/api/tables/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync('tables.json'));
  const index = data.tables.findIndex(
    table => table.id === parseInt(req.params.id)
  );
  if (index !== -1) {
    const deletedTable = data.tables.splice(index, 1)[0];
    fs.writeFileSync('tables.json', JSON.stringify(data));
    res.json('Item Deleted Successfully');
  } else {
    res.status(404).json({ error: 'Table not found' });
  }
});

// PUT /api/tables/:id - Update table data
app.put('/api/tables/:id', (req, res) => {
  const { name, columns, rows } = req.body;
  const data = JSON.parse(fs.readFileSync('tables.json'));
  const table = data.tables.find(table => table.id === parseInt(req.params.id));
  if (table) {
    table.name = name; // Update the name
    table.columns = columns;
    table.rows = rows;
    fs.writeFileSync('tables.json', JSON.stringify(data));
    res.json(table);
  } else {
    res.status(404).json({ error: 'Table not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
