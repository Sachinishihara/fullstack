const pubsub = require('./pubsub')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments({}).exec(),

    authorCount: () => Author.countDocuments({}).exec(),

    allBooks: async (root, args) => {
      const filter = {}

      if (args.genre) {
        filter.genres = args.genre
      }

      if (args.author) {
        const author = await Author.findOne({
          name: args.author
        })

        if (!author) return []

        filter.author = author._id
      }

      return Book.find(filter).populate('author').exec()
    },

    allAuthors: async () => {
      const authors = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books'
          }
        },
        {
          $addFields: {
            bookCount: { $size: '$books' }
          }
        },
        {
          $project: {
            books: 0
          }
        }
      ])

      return authors.map(author => ({
        ...author,
        id: author._id.toString()
      }))
    },

    me: (root, args, context) => context.currentUser
  },



  Author: {
    bookCount: root => {
      if (root.bookCount !== undefined) {
        return root.bookCount
      }

      return Book.countDocuments({
        author: root._id
      }).exec()
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      try {
        let author = await Author.findOne({
          name: args.author
        })

        if (!author) {
          author = new Author({ name: args.author })
        }

        const book = new Book({
          ...args,
          author: author._id
        })

        await book.validate()

        if (author.isNew) {
          await author.save()
        }

        await book.save()

        const savedBook = await book.populate('author')
        await pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
        return savedBook
      } catch (error) {
        throw new GraphQLError(
          `Saving book failed: ${error.message}`,
          {
            extensions: { code: 'BAD_USER_INPUT' }
          }
        )
      }
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }

      const author = await Author.findOne({
        name: args.name
      })

      if (!author) return null

      author.born = args.setBornTo

      try {
        return await author.save()
      } catch (error) {
        throw new GraphQLError(
          `Saving author failed: ${error.message}`,
          {
            extensions: { code: 'BAD_USER_INPUT' }
          }
        )
      }
    },

    createUser: async (root, args) => {
      const user = new User(args)

      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError(
          `Creating user failed: ${error.message}`,
          {
            extensions: { code: 'BAD_USER_INPUT' }
          }
        )
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username
      })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(
          userForToken,
          process.env.JWT_SECRET
        )
      }
    }
  }
}

module.exports = resolvers



