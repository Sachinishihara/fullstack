import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',

  initialize: async () => {
    const anecdotes = await anecdoteService.getAll()
    set({ anecdotes })
  },

  setFilter: filter => set({ filter }),

  addAnecdote: async content => {
    const newAnecdote = await anecdoteService.createNew(content)

    set(state => ({
      anecdotes: state.anecdotes.concat(newAnecdote)
    }))
  },

  vote: async id => {
    const anecdote = get().anecdotes.find(a => a.id === id)

    const updated = await anecdoteService.update(id, {
      ...anecdote,
      votes: anecdote.votes + 1
    })

    set(state => ({
      anecdotes: state.anecdotes.map(a =>
        a.id === id ? updated : a
      )
    }))
  },

  removeAnecdote: async id => {
    const anecdote = get().anecdotes.find(a => a.id === id)

    if (!anecdote || anecdote.votes !== 0) {
      return
    }

    await anecdoteService.remove(id)

    set(state => ({
      anecdotes: state.anecdotes.filter(a => a.id !== id)
    }))
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes
    .filter(a =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    )
    .toSorted((a, b) => b.votes - a.votes)
}

export default useAnecdoteStore