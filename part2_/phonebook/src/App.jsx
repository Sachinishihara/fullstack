
import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ search, handleSearchChange }) => (
  <div>
    filter shown with: <input value={search} onChange={handleSearchChange} />
  </div>
)

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, addPerson }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <button type="submit">add</button>
  </form>
)

const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>delete</button>
      </p>
    ))}
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id === existingPerson.id ? returnedPerson : person
            ))
            setNewName('')
            setNewNumber('')
            showMessage(`Updated ${newName}`, 'success')
          })
          .catch(error => {
            showMessage(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }

    const person = {
      name: newName,
      number: newNumber
    }

    personService
      .create(person)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${returnedPerson.name}`, 'success')
      })
      .catch(error => {
        showMessage('Failed to add person', 'error')
      })
  }

  const deletePerson = id => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          showMessage(`Failed to delete ${person.name}`, 'error')
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter
        search={search}
        handleSearchChange={event => setSearch(event.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={event => setNewName(event.target.value)}
        handleNumberChange={event => setNewNumber(event.target.value)}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
