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
  Person
    .count({})
    .then(result => {
      res.send(`Phonebook has info for ${result} people
      <br><br>${new Date()}`)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(people => res.json(people));
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  newPerson
    .save()
    .then(savedPerson => res.json(savedPerson))
    .catch(e => next(e));
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }

  next(error);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})