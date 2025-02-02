const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// In-memory storage for simplicity
let notes = [];

// GET all notes
app.get('/notes', (req, res) => {
  console.log('All notes retrieved');
  res.json(notes);
});

// GET a single note by ID
app.get('/notes/:id', (req, res) => {
  const note = notes.find(n => n.id === req.params.id);
  if (note) {
    console.log(`Note retrieved: ${JSON.stringify(note)}`);
    res.json(note);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

// POST create a new note
app.post('/notes', (req, res) => {
  const { title, content, updatedAt } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    content,
    updatedAt: updatedAt || new Date().toISOString(),
  };
  notes.push(newNote);
  console.log(`Note created: ${JSON.stringify(newNote)}`);
  res.status(201).json(newNote);
});

// PUT update an existing note
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, updatedAt } = req.body;

  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title || notes[noteIndex].title,
      content: content || notes[noteIndex].content,
      updatedAt: updatedAt || new Date().toISOString(),
    };
    console.log(`Note updated: ${JSON.stringify(notes[noteIndex])}`);
    res.json(notes[noteIndex]);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

// DELETE a note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(n => n.id === id);

  if (noteIndex !== -1) {
    const deletedNote = notes.splice(noteIndex, 1);
    console.log(`Note deleted: ${JSON.stringify(deletedNote)}`);
    res.json(deletedNote[0]);
  } else {
    res.status(404).json({ message: 'Note not found' });
  }
});

app.listen(port, () => {
  console.log(`Notes API server running at http://localhost:${port}`);
});
