const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const time = new Date
const app = express()
app.use(express.json())
morgan.token('bodyJSON', function (request) {
  console.log(request.body)
  return JSON.stringify(request.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyJSON'))

let persons =
  [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]


const info = () => {
  return (
    `<p>Phonebook has info for ${persons.length} people.</p><br />${time.toString()}`
  )
}


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
  console.log("GET ok")
})

app.get('/info', (req, res) => {
  res.send(info())
  console.log("GET ok")
})

app.get('/api/persons', (req, res) => {
  console.log(res.body)
  console.log(req.body)
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(pers => pers.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
  console.log(persons)
})

app.post('/api/persons', (request, response) => {
  const id = Math.floor(10000 * Math.random())
  const contact = request.body
  if (!contact.number) return response.status(400).json({ error: 'number missing!' })
  if (!contact.name) return response.status(400).json({ error: 'name missing!' })
  if (persons.some(person => person.name === contact.name)) return response.status(400).json({ error: 'Name exists already!' })
  contact.id = id
  persons = persons.concat(contact)
  response.json(contact)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})