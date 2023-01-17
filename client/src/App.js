import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ChatRooms } from './pages/ChatRooms'
import { Home } from './pages/Home'

function App() {
  return (
    <>
      <div id='appContainer'>
        <BrowserRouter>
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
