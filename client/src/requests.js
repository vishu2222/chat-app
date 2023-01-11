const url = 'http://localhost:3000/'

export async function checkUserNameAvailable(userName) {
  const res = await fetch(url + 'is-available/' + userName)
  const response = await res.json()
  return response.status
}

export async function signupUser(userName, password) {
  const res = await fetch(url + 'sign-up', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function authenticateUser() {
  const res = await fetch(url + 'authenticate-user', {
    credentials: 'include'
  })
  return res.status
}

export async function signIn(userName, password) {
  const res = await fetch(url + 'login', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function signOut() {
  const res = await fetch(url + 'logout', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  })
  return res.status
}

export async function getRooms() {
  const res = await fetch(url + 'rooms-list', { credentials: 'include' })
  return await res.json()
}

export async function getGeneralRoomMsgs() {
  const res = await fetch(url + 'default-room-msgs', { credentials: 'include' })
  return await res.json()
}

export async function getRoomMsgs(roomId) {
  const res = await fetch(url + 'msgs/' + roomId, { credentials: 'include' })
  return await res.json()
}

export async function joinUser(room) {
  const res = await fetch(url + 'join-room', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room })
  })

  return res.status
}

export async function createNewRoom(room) {
  const res = await fetch(url + 'create-room', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room })
  })
  return res.status
}
