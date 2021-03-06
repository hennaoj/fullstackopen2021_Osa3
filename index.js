require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

//tulostetaan kaikki http-pyynnöt ja niiden sisällöt konsoliin
app.use(morgan(':method :url :status :res[content-length]  - :response-time ms  :body'))

app.get('/api/persons', (req, res) => {
    //hakee ja palauttaa kaikki yhteystiedot tietokannasta
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    //kertoo, montako yhteystietoa puhelinluettelossa on ja pyynnön ajan
    const date = new Date()
    var length = 0 //alustetaan yhteystietojen lukumäärä
    Person.find({}).then(persons => {
        //käydään läpi kaikki henkilöt ja kasvatetaan length-muuttujaa
        persons.forEach(() => {
            length = length + 1
            return length
        })
        res.send(
            `<div>
                <p>Phonebook has info for ${length} people</p>
                <p>${date}</p>
            </div>`
        )
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    //hakee ja palauttaa tietyn yhteystiedon tietokannasta id:n perusteella
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    //poistaa yhteystiedon tietokannasta id:n perusteella
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    //lisää uuden nimen tietokantaan
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error)) //jos lisättävä yhteystieto ei vastaa vaatimuksia, käsitellään virhe

})

app.put('/api/persons/:id', (request, response, next) => {
    //muokataan olemassa olevaa yhteystietoa id:n avulla
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'MongoError') {
        return response.status(400).json({ error: 'this person is already in the phonebook' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`<p>Server running on port ${PORT}</p>`)
})