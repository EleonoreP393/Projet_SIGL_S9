import { useState } from 'react'
import './App.css'
import Login from './pages/login'
import JournalDeFormation from './pages/JournalDeFormation'
import Home from './pages/home'
import Notification from './pages/notification'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Notification/>
    </>
  )
}

export default App
