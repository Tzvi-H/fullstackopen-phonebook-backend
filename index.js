const express = require('express');
const morgan = require('morgan');
let persons = require('./db.json')
const PORT = 3001;
const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people
  <br><br>
  ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({error: 'name is missing'});
  } else if (!req.body.number) {
    return res.status(400).json({error: 'number is missing'});
  } else if (persons.some(p => p.name.toLowerCase() === req.body.name.toLowerCase())) {
    return res.status(400).json({error: 'name already exists'});
  }

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(1 + Math.random() * 10000)
  }


  persons = persons.concat(newPerson);

  res.json(newPerson);
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})