const mongoose = require('mongoose')

const [ password, name, number ] = process.argv.slice(2)

if (!password) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const url =
`mongodb+srv://16guitar:${password}@cluster0.qri5m.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose
  .connect(url)
  .then(() => console.log('connected'))
  .catch(() => {
    console.log('not able to connect')
    process.exit(1)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
  const newPerson = new Person({
    name,
    number
  })
  createPerson(newPerson)
} else {
  getPersons()
}

function getPersons() {
  Person
    .find({})
    .then(results => {
      console.log('phonebook:')
      results.forEach(p => console.log(`${p.name} ${p.number}`))
      mongoose.connection.close()
      console.log('connection closed')
    })
}

function createPerson(newPerson) {
  newPerson
    .save()
    .then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
      console.log('connection closed')
    })
}