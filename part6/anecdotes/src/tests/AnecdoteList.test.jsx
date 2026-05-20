import { render, screen } from '@testing-library/react'
import { beforeEach, test, expect } from 'vitest'
import AnecdoteList from '../components/AnecdoteList'

// MOCK Zustand store
import { useAnecdoteStore } from '../store/anecdoteStore'

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [
      { id: 1, content: 'low votes', votes: 1 },
      { id: 2, content: 'high votes', votes: 5 },
    ],
    filter: '',
    vote: () => {},
    deleteAnecdote: () => {},
  })
})

test('renders anecdotes sorted by votes', () => {
  render(<AnecdoteList />)

  const anecdotes = screen.getAllByTestId('anecdote')

  expect(anecdotes[0]).toHaveTextContent('high votes')
})