import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signIn } from '../requests.js'
import '../styles/login.css'

export function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  async function login() {
    if (userName.trim().length === 0) return
    if (password.length < 4) {
      setDisplayErr(true)
      setErrMsg('* password length should be greater than 4')
      return
    }

    const status = await signIn(userName, password)
    if (status === 404) {
      setDisplayErr(true)
      setErrMsg('* userName not found')
      return
    }

    if (status === 401) {
      setDisplayErr(true)
      setErrMsg('* Password invalid')
      return
    }

    window.localStorage.setItem('userName', userName)
    navigate('/chatRooms')
  }

  return (
    <div id='login'>
      <form onSubmit={(e) => e.preventDefault()}>
        <h2> Login</h2>
        <label>
          <strong> User Name: </strong>
        </label>
        <input
          type='text'
          onChange={(e) => {
            setUserName(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label>
          <strong> Password: </strong>
        </label>
        <input
          type='password'
          onChange={(e) => {
            setPassword(e.target.value)
            setDisplayErr(false)
          }}
        />
        <button className='button' onClick={login}>
          Login
        </button>
      </form>
      <br />

      <h3>
        New user? <Link to='/register'>signup</Link>
      </h3>
      {displayErr && <h3 className='err-msg'>{errMsg}</h3>}
    </div>
  )
}
