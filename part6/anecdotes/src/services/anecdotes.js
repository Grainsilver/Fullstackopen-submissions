const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('failed fetching anecdotes')
  }

  return response.json()
}

export const createAnecdote = async (
  anecdote
) => {
  const response = await fetch(baseUrl, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(anecdote)
  })

  if (!response.ok) {
    throw new Error(
      'anecdote must be at least 5 characters long'
    )
  }

  return response.json()
}

export const updateAnecdote = async (
  anecdote
) => {
  const response = await fetch(
    `${baseUrl}/${anecdote.id}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(anecdote)
    }
  )

  if (!response.ok) {
    throw new Error('failed updating anecdote')
  }

  return response.json()
}