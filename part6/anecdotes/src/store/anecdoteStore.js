import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',

  fetchAnecdotes: async () => {
    const response = await fetch(baseUrl)
    const data = await response.json()

    set({
      anecdotes: data
    })
  },

  addAnecdote: async (content) => {
    const newAnecdote = {
      content,
      votes: 0
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAnecdote)
    })

    const saved = await response.json()

    set((state) => ({
      anecdotes: [...state.anecdotes, saved]
    }))
  },

  vote: async (id) => {
    const anecdote = get().anecdotes.find((a) => a.id === id)

    const updated = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updated)
    })

    const saved = await response.json()

    set((state) => ({
      anecdotes: state.anecdotes.map((a) =>
        a.id === id ? saved : a
      )
    }))
  },

  deleteAnecdote: async (id) => {
    await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    })

    set((state) => ({
      anecdotes: state.anecdotes.filter((a) => a.id !== id)
    }))
  },

  setFilter: (value) => set({ filter: value })
}))