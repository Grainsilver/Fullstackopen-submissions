import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'

import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
} from '../services/anecdotes'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const anecdotesQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const createMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })
    }
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })
    }
  })

  return {
    anecdotesQuery,
    createMutation,
    voteMutation
  }
}