const express = require('express')
const cors = require('cors')
const http = require('node:http')
const jwt = require('jsonwebtoken')

const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')

const startServer = async port => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization

        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET
            )

            const currentUser = await User.findById(
              decodedToken.id
            )

            return { currentUser }
          } catch {
            return { currentUser: null }
          }
        }

        return { currentUser: null }
      }
    })
  )

  httpServer.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`)
  })
}

module.exports = startServer
