import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = type => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  return {
    input: { type, value, onChange },
    value,
    reset
  }
}

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = async anecdote => {
    const created = await anecdoteService.createNew(anecdote)
    setAnecdotes(previous => previous.concat(created))
  }

  const deleteAnecdote = async id => {
    await anecdoteService.remove(id)
    setAnecdotes(previous => previous.filter(a => a.id !== id))
  }

  return { anecdotes, addAnecdote, deleteAnecdote }
}
