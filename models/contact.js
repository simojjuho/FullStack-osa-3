const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to', url )

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })



const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d*\d{2}-\d{5,}/.test(v)
            }
        }
    }
    })

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Contact', contactSchema)