import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h1>Anecdotes</h1>

      <Notification />

      <AnecdoteForm />

      <AnecdoteList />
    </div>
  )
}

export default App
