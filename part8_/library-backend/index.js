require('dotenv').config()

const connectToDatabase = require('./db')
const startServer = require('./server')

const main = async () => {
  await connectToDatabase(process.env.MONGODB_URI)
  await startServer(Number(process.env.PORT) || 4000)
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
