import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { authenticateUser } from '../requests'

export function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function authenticate() {
      const [statusCode, userName] = await authenticateUser()
      if (userName !== window.localStorage.getItem('userName')) return navigate('/login')
      if (statusCode === 200) return navigate(`/chat`)
      navigate('/login')
    }
    authenticate()
  }, [navigate])

  return <></>
}
