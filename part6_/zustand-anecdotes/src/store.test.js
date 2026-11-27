import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes } from './store'

const anecdotes = [
  { id: '1', content: 'First anecdote', votes: 2 },
  { id: '2', content: 'Second anecdote', votes: 5 },
  { id: '3', content: 'Third anecdote', votes: 0 }
]

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: ''
  })

  vi.clearAllMocks()
})

describe('anecdote store', () => {
  // 6.12
  it('initializes anecdotes from backend', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    await act(async () => {
      await useAnecdoteStore.getState().initialize()
    })

    expect(useAnecdoteStore.getState().anecdotes)
      .toEqual(anecdotes)
  })

  // 6.13
  it('sorts anecdotes by votes', () => {
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      anecdotes[1],
      anecdotes[0],
      anecdotes[2]
    ])
  })

  // 6.14
  it('filters anecdotes correctly', () => {
    useAnecdoteStore.setState({
      anecdotes,
      filter: 'Second'
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([anecdotes[1]])
  })

  // 6.15
  it('increases votes by one', async () => {
    useAnecdoteStore.setState({ anecdotes })

    anecdoteService.update.mockResolvedValue({
      ...anecdotes[0],
      votes: 3
    })

    await act(async () => {
      await useAnecdoteStore.getState().vote('1')
    })

    expect(anecdoteService.update).toHaveBeenCalledWith(
      '1',
      { ...anecdotes[0], votes: 3 }
    )

    expect(useAnecdoteStore.getState().anecdotes[0].votes)
      .toBe(3)
  })
})
