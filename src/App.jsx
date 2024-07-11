import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'


function App() {


  return (
    <Routes>
    <Route path='/' element= {<Home />} />
    <Route path='login' element= {<Login />} />
    
    </Routes>
      
  )
}

export default App
