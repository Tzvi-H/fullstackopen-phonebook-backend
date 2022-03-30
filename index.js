require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT;

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(cors());
app.use(express.static('build'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
  <br><br>
  ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => res.json(people));
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findByID(req.params.id)
    .then(person => res.json(person));
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({error: 'name is missing'});
  } else if (!req.body.number) {
    return res.status(400).json({error: 'number is missing'});
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson
    .save()
    .then(savedPerson => res.json(savedPerson));
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end());
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})