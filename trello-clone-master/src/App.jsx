import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DragDropBoard from './DragDropBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <DragDropBoard />
    </>
  )
}

export default App
