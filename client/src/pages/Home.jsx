import { authenticate } from '../requests'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

export function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function fun() {
      const userName = JSON.parse(window.localStorage.getItem('userName'))
      console.log('localStorage userName: ', userName)
      if (userName === null) navigate('/login')
      const status = await authenticate(userName)
      console.log('authenticate-status: ', status)
      //   if (status === false) navigate('/login')
    }
    fun()
  }, []) // TODO else go to chat room
  return (
    <div>
      <h1>Welcome</h1>
      <Link to="/login"></Link>
    </div>
  )
}
