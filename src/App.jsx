import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Artistas from './pages/artistas/Artistas'
import Galeria from './pages/galeria/Galeria'


function App() {


  return (
    <Routes>
    <Route path='/' element= {<Home />} />
    <Route path='login' element= {<Login />} />
    <Route path='artistas' element= {<Artistas />} />
    <Route  path='galeria' element= {<Galeria />} />
    
    </Routes>
      
  )
}

export default App
