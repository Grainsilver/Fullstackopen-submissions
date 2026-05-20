import { useAnecdotes } from '../hooks/useAnecdotes'
import { useNotify } from '../context/NotificationContext'

const AnecdoteList = () => {
  const { anecdotesQuery, voteMutation } =
    useAnecdotes()

  const [, notify] = useNotify()

  if (anecdotesQuery.isPending) {
    return <div>loading...</div>
  }

  if (anecdotesQuery.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = anecdotesQuery.data

  const vote = (anecdote) => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })

    notify(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map((a) => (
          <div
            key={a.id}
            data-testid="anecdote"
          >
            <div>{a.content}</div>

            <div>
              has {a.votes} votes
            </div>

            <button
              onClick={() => vote(a)}
            >
              vote
            </button>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList