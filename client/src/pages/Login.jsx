import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div id="login">
      <form onSubmit={(e) => e.preventDefault()}>
        <h2> Login</h2>
        <label>
          <strong> User Name: </strong>
        </label>
        <input type="text" />
        <label>
          <strong> Password: </strong>
        </label>
        <input type="password" />
        <button>Join</button>
      </form>
      <br />
      <h3>
        New user? <Link to="/register">signup</Link>
      </h3>
    </div>
  )
}
