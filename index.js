const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length]  - :response-time ms  :body'));

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const id = Math.floor(Math.random() * 1000)
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: id,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`<p>Server running on port ${PORT}</p>`)
})
  