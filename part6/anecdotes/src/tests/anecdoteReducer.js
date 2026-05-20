import { describe, test, expect } from 'vitest'
import anecdoteReducer, { initializeAnecdotes, voteAnecdote } from '../reducers/anecdoteReducer'

describe('anecdote reducer', () => {
  test('initializes state with backend anecdotes', () => {
    const initialState = []

    const anecdotesFromBackend = [
      { id: 1, content: 'test 1', votes: 0 },
      { id: 2, content: 'test 2', votes: 0 },
    ]

    const state = anecdoteReducer(initialState, initializeAnecdotes(anecdotesFromBackend))

    expect(state).toHaveLength(2)
    expect(state).toEqual(anecdotesFromBackend)
  })

  test('voting increases votes', () => {
    const startState = [
      { id: 1, content: 'test', votes: 0 },
    ]

    const action = voteAnecdote(1)

    const state = anecdoteReducer(startState, action)

    expect(state[0].votes).toBe(1)
  })
})