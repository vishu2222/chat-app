import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkUserNameExists, signupUser } from '../requests.js'

export function Register() {
  // state
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMismatchErr, setPwdMismatchErr] = useState(false)
  const [userNameExistsErr, setUserNameExitsErr] = useState(false)

  // methods

  async function registerUser() {
    if (userName === '' || password.length < 4) return
    if (password !== confirmPwd) {
      setPwdMismatchErr(true)
      return
    }
    const userExists = await checkUserNameExists(userName)
    if (userExists) {
      setUserNameExitsErr(true)
      return
    }
    // validate pwd
    // clear errors when typing
    // add error for passwordlength
    signupUser(userName, password)
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
            setUserName(e.target.value)
            if (userNameExistsErr) {
              setUserNameExitsErr(false)
            }
          }}
        />
        <label>
          <strong> Password: </strong>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <strong> Confirm Password: </strong>
        </label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        />
        <br />
        <br />
        <button onClick={registerUser}>Register</button>
        <h3>
          Already registered? <Link to="/">Login</Link>
        </h3>
        {pwdMismatchErr && <h3 className="err-msg">* passwords dont match</h3>}
        {userNameExistsErr && (
          <h3 className="err-msg">* choose different userName</h3>
        )}
      </form>
    </div>
  )
}
