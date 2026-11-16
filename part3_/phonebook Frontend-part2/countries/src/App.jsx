
import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]
  const latitude = country.capitalInfo?.latlng?.[0]
  const longitude = country.capitalInfo?.latlng?.[1]

  useEffect(() => {
    setWeather(null)

    if (latitude === undefined || longitude === undefined) {
      return
    }

    axios
      .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code`)
      .then(response => {
        setWeather(response.data.current)
      })
      .catch(error => {
        console.log('Could not load weather', error)
      })
  }, [latitude, longitude])

  if (!capital) {
    return null
  }

  return (
    <div>
      <h2>Weather in {capital}</h2>

      {weather ? (
        <div>
          <p>Temperature {weather.temperature_2m} Celsius</p>
          <p>Wind {weather.wind_speed_10m} km/h</p>
        </div>
      ) : (
        <p>Weather information not available</p>
      )}
    </div>
  )
}

const Country = ({ country }) => {
  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital?.[0] || 'Not available'}</p>
      <p>Area {country.area}</p>

      <h3>Languages</h3>

      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || country.name.common}
        width="150"
      />

      <Weather country={country} />
    </div>
  )
}

const Countries = ({ countries, search, setSearch }) => {
  if (search.trim() === '') {
    return <p>Enter a country name</p>
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length === 0) {
    return <p>No matches found</p>
  }

  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />
  }

  return (
    <div>
      {filteredCountries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSearch(country.name.common)}>
            show
          </button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log('Could not load countries', error)
      })
  }, [])

  return (
    <div>
      find countries: <input
        value={search}
        onChange={event => setSearch(event.target.value)}
      />

      <Countries
        countries={countries}
        search={search}
        setSearch={setSearch}
      />
    </div>
  )
}

export default App
