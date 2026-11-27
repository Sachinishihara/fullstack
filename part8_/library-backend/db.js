const mongoose = require('mongoose')

const connectToDatabase = async uri => {
  await mongoose.connect(uri, {
    dbName: 'library',
    family: 4
  })

  console.log('connected to MongoDB')
}

module.exports = connectToDatabase
