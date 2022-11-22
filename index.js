require('dotenv').config()
const express = require('express')
const Contact = require('./models/contact')
const morgan = require('morgan')
const cors = require('cors')
const contact = require('./models/contact')
const time = new Date
const app = express()
app.use(express.json())
app.use(express.static('build'))
morgan.token('bodyJSON', function (request) {
  console.log(request.body)
  return JSON.stringify(request.body)
});
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))


const info = () => {
  return (
    `<p>Phonebook has info for ${persons.length} people.</p><br />${time.toString()}`
  )
}


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Contact.find({}).then(contacts => {
    response.send(`<p>Phonebook has info for ${contacts.length} people.</p><br />${time.toString()}`)
  })
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Contact.findById(id)
    .then(contact => {
      if(contact) response.json(contact)
      else {response.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
 
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

  const contact = {
    name: request.body.name,
    number: request.body.number
  }
  Contact.findByIdAndUpdate(
    request.params.id,
    contact,
    {  new: true, runValidators: true, context: 'query'  }
  )
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const contact = new Contact({
    name: request.body.name,
    number: request.body.number
  })

  if (contact.name === undefined || contact.number === undefined) return response.status(400).json({ error: 'content missing!' })

  contact.save()
    .then(savedNumber => {
    response.json(savedNumber)
  })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if(error.name === "CastError") {
    return response.status(404).send({ error: 'malformatted id'})
  } else if(error.name === 'ValidationError') {
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})