const express = require('express');
const persons = require('./db.json')
const PORT = 3001;
const app = express();

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
  <br><br>
  ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})