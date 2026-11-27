import useFeedbackStore from './store'

const App = () => {
  const good = useFeedbackStore(state => state.good)
  const neutral = useFeedbackStore(state => state.neutral)
  const bad = useFeedbackStore(state => state.bad)

  const incrementGood = useFeedbackStore(state => state.incrementGood)
  const incrementNeutral = useFeedbackStore(state => state.incrementNeutral)
  const incrementBad = useFeedbackStore(state => state.incrementBad)

  const all = good + neutral + bad
  const average = all === 0 ? 0 : (good - bad) / all
  const positive = all === 0 ? 0 : good / all * 100

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={incrementGood}>good</button>
      <button onClick={incrementNeutral}>neutral</button>
      <button onClick={incrementBad}>bad</button>

      <h1>statistics</h1>

      {all === 0 ? (
        <div>No feedback given</div>
      ) : (
        <table>
          <tbody>
            <tr><td>good</td><td>{good}</td></tr>
            <tr><td>neutral</td><td>{neutral}</td></tr>
            <tr><td>bad</td><td>{bad}</td></tr>
            <tr><td>all</td><td>{all}</td></tr>
            <tr><td>average</td><td>{average}</td></tr>
            <tr><td>positive</td><td>{positive} %</td></tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App