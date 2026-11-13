import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Home from './Pages/Home'
import PokeDetails from './Pages/PokeDetails'

function App() {
  
  return (
    <>
      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/pokeDetails/1">Pokémon Details</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokeDetails/:id" element={<PokeDetails />} />
      </Routes>
    </>
  )
}

export default App
