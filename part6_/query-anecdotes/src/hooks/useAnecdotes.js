import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from '../requests'

import useNotify from './useNotify'

const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you created '${anecdote.content}'`)
    },
    onError: () => {
      notify('could not create anecdote')
    }
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: anecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you voted '${anecdote.content}'`)
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,

    addAnecdote: content => {
      newAnecdoteMutation.mutate({ content, votes: 0 })
    },

    vote: anecdote => {
      voteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1
      })
    }
  }
}

export default useAnecdotes
