import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { authenticateUser } from '../requests'

export function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    async function authenticate() {
      const statusCode = await authenticateUser()
      if (statusCode === 200) return navigate(`/chat`)
      navigate('/login')
    }
    authenticate()
  }, [navigate])

  return <></>
}
