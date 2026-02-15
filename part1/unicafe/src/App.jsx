import { useState } from 'react'

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  const average =(good - bad) / all
  const positive = (good / all) * 100
  if (all === 0) {
    return (
      <div>No feedback given</div>
    )
  } else {
    return (  
       <div>
    <StatisticLine text="good" value={good} />
    <StatisticLine text="neutral" value={neutral} />
    <StatisticLine text="bad" value={bad} />
    <StatisticLine text="all" value={all} />
    <StatisticLine text="average" value={average} />
    <StatisticLine text="positive" value={positive + "%"} />
    </div>
  )}
}

const StatisticLine = ({text, value}) => {
  return (
   
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
      </tbody>
    </table>
  )
}
const Button = ({handleClick, text}) => {
  return (<button onClick={handleClick}>{text}</button>)
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] =useState(0)

const handleGood = () => {
  setGood(good + 1
  )
}

const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

return (
 <div>
    <h1>give feedback</h1>

    <Button text="good" handleClick={handleGood} />
    <Button text="neutral" handleClick={handleNeutral} />
    <Button text="bad" handleClick={handleBad} />

    <h1>statistics</h1>
    <Statistics good={good} neutral={neutral} bad={bad} /> 
  </div>
)
}
export default App
