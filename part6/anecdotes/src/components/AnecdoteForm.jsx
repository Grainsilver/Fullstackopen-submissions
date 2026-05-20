import { useState } from 'react'
import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotify } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const [content, setContent] = useState('')

  const { createMutation } = useAnecdotes()

  const [, notify] = useNotify()

  const handleSubmit = (e) => {
    e.preventDefault()

    createMutation.mutate(
      {
        content,
        votes: 0
      },

      {
        onSuccess: () => {
          notify(`you created '${content}'`)
        },

        onError: () => {
          notify(
            'too short anecdote, must have length 5 or more'
          )
        }
      }
    )

    setContent('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      <button type="submit">
        create
      </button>
    </form>
  )
}

export default AnecdoteForm