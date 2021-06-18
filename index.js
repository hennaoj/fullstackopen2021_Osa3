require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length]  - :response-time ms  :body'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
    const date = new Date()
    const length = persons.length
    res.send(
        `<div>
            <p>Phonebook has info for ${length} people</p>
            <p>${date}</p>
         </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }

    if (body.number === undefined) {
      return response.status(400).json({ error: 'number missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`<p>Server running on port ${PORT}</p>`)
})
  