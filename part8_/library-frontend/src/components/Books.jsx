import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const allBooks = useQuery(ALL_BOOKS)

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: 'cache-and-network'
  })

  if (!show) return null

  if (result.loading && !result.data) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>{result.error.message}</div>
  }

  const books = result.data?.allBooks || []

  const genres = [
    ...new Set(
      (allBooks.data?.allBooks || []).flatMap(book => book.genres)
    )
  ]

  return (
    <div>
      <h2>books</h2>

      <p>in genre <strong>{genre || 'all genres'}</strong></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.map(g => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}

      <button onClick={() => setGenre(null)}>
        all genres
      </button>
    </div>
  )
}

export default Books
