import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ChatRooms } from './pages/ChatRooms'
import { Home } from './pages/Home'
import { signOut } from './requests'

function App() {
  async function logout() {
    await signOut()
  }

  return (
    <>
      <div id='appContainer'>
        <BrowserRouter>
          <div id='Nav-div'>
            <Link to='/register' className='nav-links'>
              Register
            </Link>
            <Link to='/login' className='nav-links'>
              Login
            </Link>
            <Link to='/login' className='nav-links' onClick={logout}>
              LogOut
            </Link>
          </div>

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/chatRooms' element={<ChatRooms />} />
            <Route path='*' element={<h1>Page not found</h1>} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App

//{
/* <div id='title'>
<p>
  <strong>Welcome {localStorage.getItem('userName')}</strong>
</p>
</div> */
//}
