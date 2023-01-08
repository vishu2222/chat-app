import { useNavigate } from 'react-router-dom'
import { authenticateUser } from '../requests'

export function Home() {
  const navigate = useNavigate()

  async function authenticate() {
    const statusCode = await authenticateUser()
    if (statusCode === 200) return navigate(`/chatRooms`)
    navigate('/login')
  }

  authenticate()

  return <></>
}
