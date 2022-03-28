const express = require('express');
const persons = require('./db.json')
const PORT = 3001;
const app = express();

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})