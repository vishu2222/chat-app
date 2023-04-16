// const url = process.env.REACT_APP_NODE_ENV === 'development' ? 'http://localhost:3000/api/' : 'https://vishus-chat-app.onrender.com/'

const url = 'https://vishus-chat-app.onrender.com/api/'

export async function checkUserNameAvailable(userName) {
  const res = await fetch(url + 'users/' + userName + '/check')
  const response = await res.json()
  return response.available
}

export async function signupUser(userName, password) {
  const res = await fetch(url + 'users/sign-up', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function authenticateUser() {
  const res = await fetch(url + 'users/me', {
    credentials: 'include'
  })
  return res.status
}

export async function signIn(userName, password) {
  const res = await fetch(url + 'users/login', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function signOut() {
  const res = await fetch(url + 'users/logout', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  })
  return res.status
}

export async function getRooms() {
  const res = await fetch(url + 'rooms/list', { credentials: 'include' })
  return await res.json()
}

export async function getGeneralRoomMsgs() {
  const res = await fetch(url + 'msgs/default-room', { credentials: 'include' })
  return await res.json()
}

export async function getRoomMsgs(roomId) {
  const res = await fetch(url + 'msgs/' + roomId, { credentials: 'include' })
  return await res.json()
}

export async function joinUser(room) {
  const res = await fetch(url + 'rooms/join-room', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room })
  })

  return res.status
}

export async function createNewRoom(room) {
  const res = await fetch(url + 'rooms/create-room', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room })
  })
  return res.status
}
