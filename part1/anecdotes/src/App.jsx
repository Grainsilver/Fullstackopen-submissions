import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for thee first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time',
    'Any  can write code that a computer can understand. God programmers write code that human can understand',
    'Premature optimization is the root of all evil',
    'Debugging is twisw as hard as write the code in the first place. Therefore, if you write the code as cleverly as possible, you are, bt definition not smart to debug it.',
    'Programming without an extremely heavy use of console.log is same as a doctor would refuse to x-ray or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

const handleClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

   const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }
  
    const maxVotes = Math.max(...votes)
  const mostVotedIndex = votes.indexOf(maxVotes)

  return (
    <div>
      {anecdotes[selected]}
      <div>
        <p>has {votes[selected]} votes </p>

<button onClick={vote}>vote</button>
</div>
      <button onClick={nextAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
     {maxVotes > 0 ? (
      <>
       <p>{anecdotes[mostVotedIndex]}</p>
          <p>has {maxVotes} votes</p>
      </>
     ) : (
 <p>No votes yet</p>
     )
     }
    </div>
  )
}

export default App
