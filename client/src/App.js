import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Home } from './pages/Login';

function App() {
  return (
    <div id='appContainer'>
      <BrowserRouter>
        <div id='nav'>
          <Link to='/'>Home</Link>
        </div>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>)
}

export default App;
