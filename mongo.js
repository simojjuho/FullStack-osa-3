const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://js-fullstack:${password}@hyfs22.lrperjl.mongodb.net/contactListApp?retryWrites=true&w=majority`

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length == 5) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })

    contact.save().then(result => {
        console.log('Contact saved')
        mongoose.connection.close()
    })
} else {
    console.log(`phonebook:`)
    Contact.find({}).then(result => {
        result.forEach(contact => console.log(contact.name, contact.number))
        mongoose.connection.close()
    })
    

}


