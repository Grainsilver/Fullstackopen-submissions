import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import phonebook from './phone/phonebook'
import Notification from './Notification' 



const Filter = ({ filter, handleFilterChange}) => (
    <div>
        <p>filter shown with</p><input value={filter} onChange={handleFilterChange}/>
      </div>
)


const PersonForm = ({ newName, number, handleNumberChange, handleNameChange, addName}) => (
<form onSubmit={addName}>
         <div className='input'>
          name: <input value={newName}
          onChange={handleNameChange}/>
        </div>

         <div className='number'>number: <input value={number} onChange={handleNumberChange}/></div>
        <div>
          <button  type="submit" className='add-button'>add</button>
        </div>

      </form>
)

const Persons = ({ persons, deletePerson}) => (
<div className='nums'>
   <h1>Numbers</h1>
  <ul>
      {persons.map(person =>(
        <li key={person.id}>
          {person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>
          delete
          </button>
          </li>
      ))}
     </ul>
</div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [number, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  


useEffect(() => {
  phonebook
    .getAll()
    .then(initialNotes => {
      setPersons(initialNotes)
    })
}, [])

const addName = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(
    person => person.name?.toLowerCase() === newName.toLowerCase()
  )

  const personObject = {
    name: newName,
    number: number
  }

  if (existingPerson) {
    const confirmUpdate = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )

    if (!confirmUpdate) return   // ⬅️ IMPORTANT

    phonebook
      .update(existingPerson.id, personObject)
      .then(returnedPerson => {
        setPersons(
          persons.map(p =>
            p.id === existingPerson.id ? returnedPerson : p
          )
        )

        setNotification({
          message: `Updated ${returnedPerson.name}`,
          type: 'success'
        })

        setTimeout(() => setNotification(null), 5000)

        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setNotification({
          message: `Information of ${existingPerson.name} has already been removed from server`,
          type: 'error'
        })

        setTimeout(() => setNotification(null), 5000)

        setPersons(persons.filter(p => p.id !== existingPerson.id))
      })

  } else {
    phonebook
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNotification({
          message: `Added ${returnedPerson.name}`,
          type: 'success'
        })

        setTimeout(() => setNotification(null), 5000)

        setNewName('')
        setNewNumber('')
      })
  }
}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
const handleFilterChange = (event) => {
  setFilter(event.target.value)
}
const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

const deletePerson = (id) => {
  const person = persons.find(p => p.id === id)
  
  if(window.confirm(`Delete ${person.name}?`)){
  phonebook
    .remove(id)
    .then(() => {
      setPersons(persons.filter(person => person.id !== id))
    })
    
}
}
  return (
    <div className="special">
      <h2 className='book'>Phonebook</h2> 

      <div className='filter'>
      <Notification notification={notification} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
       </div>

        <h2 className='add'>Add a new</h2>

      <PersonForm 
        newName={newName}
        handleNameChange={handleNameChange}
        number={number}
        handleNumberChange={handleNumberChange}
        addName={addName} 
        />
      

     <Persons 
     persons={filtered} 
     deletePerson={deletePerson}
     />

    </div>
  )
}

export default App

