import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK } from '../queries'

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK, {
    update: cache => {
      cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'allBooks'
      })
    },
    refetchQueries: ['AllBooks', 'AllAuthors'],
    awaitRefetchQueries: true
  })

  if (!show) return null

  const submit = async event => {
    event.preventDefault()

    await addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres
      }
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenre('')
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />

          <button type="button" onClick={addGenre}>
            add genre
          </button>
        </div>

        <div>genres: {genres.join(' ')}</div>

        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
