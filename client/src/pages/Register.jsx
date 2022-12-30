import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkUserNameExists, signupUser } from '../requests.js'

export function Register() {
  // state
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [displayErr, setDisplayErr] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const navigate = useNavigate()

  // methods

  async function registerUser() {
    if (userName === '') {
      setDisplayErr(true)
      setErrMsg('* enter user name')
      return
    }
    if (password.length < 4) {
      setDisplayErr(true)
      setErrMsg('* password length should be greater than 4')
      return
    }
    if (password !== confirmPwd) {
      setDisplayErr(true)
      setErrMsg('* passwords donot match')
      return
    }
    const userExists = await checkUserNameExists(userName)
    if (userExists) {
      setDisplayErr(true)
      setErrMsg('* User exists, choose different userName')
      return
    }

    const status = await signupUser(userName, password)
    if (status === 200) {
      navigate('/login')
    }
  }

  // component return
  return (
    <div id="register">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2> Register</h2>
        <label>
          <strong> User Name: </strong>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => {
            setDisplayErr(false)
            setUserName(e.target.value)
          }}
        />
        <label>
          <strong> Password: </strong>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setDisplayErr(false)
            setPassword(e.target.value)
          }}
        />
        <label>
          <strong> Confirm Password: </strong>
        </label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => {
            setDisplayErr(false)
            setConfirmPwd(e.target.value)
          }}
        />
        <br />
        <br />
        <button onClick={registerUser}>Register</button>
        <h3>
          Already registered? <Link to="/">Login</Link>
        </h3>
        {displayErr && <h3 className="err-msg">{errMsg}</h3>}
      </form>
    </div>
  )
}
