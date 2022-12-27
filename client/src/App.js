import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Login';
import { Register } from './pages/Register';
import { Chat } from './pages/Chat'

function App() {
  return (
    <div id='appContainer'>
      <BrowserRouter>
        <div id='nav'></div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='*' element={<h1>Page not found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>)
}

export default App;
