import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkUserNameExists, signupUser } from '../requests.js'

export function Register() {
  // state
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  // const [displayErr, setDisplayErr] = useState(false)
  // const [errMsg, setErrMsg] = useState('')

  const [pwdMismatchErr, setPwdMismatchErr] = useState(false)
  const [userNameExistsErr, setUserNameExitsErr] = useState(false)

  // methods

  async function registerUser() {
    //TODO set a generic validation err in state and print it through JSX
    // TODO if(signupUser()===true) redirect to login page else
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
          onChange={(e) => {
            if (pwdMismatchErr) {
              setPwdMismatchErr(false)
            }
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
            if (pwdMismatchErr) {
              setPwdMismatchErr(false)
            }
            setConfirmPwd(e.target.value)
          }}
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
