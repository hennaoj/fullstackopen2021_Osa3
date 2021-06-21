const mongoose = require('mongoose')

const url = process.env.MONGODB_URI //tietokannan osoite on tallennettu ympäristömuuttujaan MONGODB_URI

console.log('connecting to', url)
//yhdistetään tietokantaan
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    //personSchema määrittää, miten henkilön nimi ja numero tallennetaan tietokantaan
    name: {
        type: String,
        minlength: 3, //annetun nimen pituuden tulee olla vähintään 3 merkkkiä
        unique: true
    },
    number: {
        type: String,
        minlength: 8 //annetun numeron pituuden tulee olla vähintään 8 merkkiä
    }
})

personSchema.set('toJSON', {
    //muokataan tietokannasta palautettu olio haluttuun muotoon
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)