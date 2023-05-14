const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const port= 3000

// Create a new express app
const app = express();

// Use bodyParser middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Create a new database connection
const db = new sqlite3.Database('database.db');

// Create the "questions" table in the database if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    type TEXT NOT NULL
  );
`);

// Define routes for inserting, modifying, and removing elements of the database
app.post('/questions', (req, res) => {
  const { question, answer, type } = req.body;

  db.run('INSERT INTO questions (question, answer, type) VALUES (?, ?, ?)', question, answer, type, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
    } else {
      res.send('Question inserted successfully');
    }
  });
});

app.put('/questions/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer, type } = req.body;

  db.run('UPDATE questions SET question = ?, answer = ?, type = ? WHERE id = ?', question, answer, type, id, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
    } else {
      res.send('Question updated successfully');
    }
  });
});

app.delete('/questions/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM questions WHERE id = ?', id, err => {
    if (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
    } else {
      res.send('Question removed successfully');
    }
  });
});

// endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

// start the server
app.listen(port, () => {
    console.log(`Server listening on port http://127.0.0.1/${port}`);
  });