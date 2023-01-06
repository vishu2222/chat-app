import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Chat } from './pages/Chat'
import { Home } from './pages/Home'
import { Logout } from './pages/Logout'

function App() {
  return (
    <>
      <div id='appContainer'>
        <BrowserRouter>
          <div id='Nav-div'>
            <Link to='/'>Home</Link>
            <Link to='/login'>login</Link>
            {/* <Link to='/logout'>logOut</Link> */}
          </div>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/logout' element={Logout} />
            <Route path='*' element={<h1>Page not found</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
