import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Artistas from './pages/artistas/Artistas'
import Galeria from './pages/galeria/Galeria'
import Register from './pages/register/Register'
import Profile  from './pages/profile/Profile'



function App() {


  return (
    <Routes>
    <Route path='/' element= {<Home />} />
    <Route path='login' element= {<Login />} />
    <Route path='artistas' element= {<Artistas />} />
    <Route  path='galeria' element= {<Galeria />} />
    <Route path='register' element= {<Register />} />
    <Route path= 'profile' element= {<Profile />} />
   
    
    </Routes>
      
  )
}

export default App
