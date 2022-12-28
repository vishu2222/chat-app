import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userLogin, checkUserNameExists, getToken } from '../requests.js'

export function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const navigate = useNavigate()

  async function login() {
    if (userName === '') return
    if (password.length < 4) {
      displayErr(true)
      setErrMsg('* password length should be greater than 4')
      return
    }
    const userExists = await checkUserNameExists(userName)
    if (!userExists) {
      setDisplayErr(true)
      setErrMsg('* User name doesnt exists')
      return
    }
    const token = getToken(userName)
    const status = await userLogin(userName, password)
    if (status === 401) {
      setDisplayErr(true)
      setErrMsg('* Password invalid')
      return
    }
    // else status === 200
    window.localStorage.setItem('userName', JSON.stringify(userName))
    // navigate(`/chat/${userName}`)
  }

  return (
    <div id="login">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2> Login</h2>
        <label>
          <strong> User Name: </strong>
        </label>
        <input
          type="text"
          onChange={(e) => {
            setUserName(e.target.value)
            setDisplayErr(false)
          }}
        />
        <label>
          <strong> Password: </strong>
        </label>
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value)
            setDisplayErr(false)
          }}
        />
        <button onClick={login}>Join</button>
      </form>
      <br />

      <h3>
        New user? <Link to="/register">signup</Link>
      </h3>
      {displayErr && <h3 className="err-msg">{errMsg}</h3>}
    </div>
  )
}
