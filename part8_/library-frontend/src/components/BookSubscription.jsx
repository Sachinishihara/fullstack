import { useSubscription } from '@apollo/client/react'
import { BOOK_ADDED } from '../queries'

const BookSubscription = () => {
  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const book = data.data.bookAdded

      window.alert(`${book.title} added`)

      client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'allBooks'
      })

      client.refetchQueries({
        include: ['AllBooks']
      })
    }
  })

  return null
}

export default BookSubscription
