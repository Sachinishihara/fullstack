import { useQuery } from '@apollo/client/react'
import { ME, ALL_BOOKS } from '../queries'

const Recommendations = () => {
  const user = useQuery(ME, {
    fetchPolicy: 'network-only'
  })

  const genre = user.data?.me?.favoriteGenre

  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
    fetchPolicy: 'cache-and-network'
  })

  if (user.error || result.error) {
    return <div>Unable to load recommendations</div>
  }

  if (user.loading || result.loading) {
    return <div>loading...</div>
  }

  if (!genre) return null

  const books = result.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre
        <strong> {genre}</strong>
      </p>

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
    </div>
  )
}

export default Recommendations
