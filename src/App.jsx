import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import Home from './pages/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Home/>
    </>
  )
}

export default App
