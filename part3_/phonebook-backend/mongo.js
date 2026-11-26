
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://nadeeshihara8_db_user:${password}@cluster0.l6gcymo.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    await mongoose.connect(url, { family: 4 })

    if (process.argv.length === 3) {
      const persons = await Person.find({})

      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    } else if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]

      const person = new Person({ name, number })
      await person.save()

      console.log(`added ${name} number ${number} to phonebook`)
    } else {
      console.log('usage: node mongo.js password [name number]')
    }
  } catch (error) {
    console.error('MongoDB error:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

main()
