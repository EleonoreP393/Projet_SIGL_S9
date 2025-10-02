import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import JournalDeFormation from './pages/JournalDeFormation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <JournalDeFormation/>
    </>
  )
}

export default App
