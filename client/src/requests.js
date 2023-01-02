const url = 'http://localhost:3000/'

export async function checkUserNameExists(userName) {
  const res = await fetch(url + 'checkUser', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName })
  })
  const response = await res.json()
  return response.status
}

export async function signupUser(userName, password) {
  const res = await fetch(url + 'signUp', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function authenticateUser() {
  const res = await fetch(url + 'authenticateUser', {
    credentials: 'include'
  })
  if (res.status !== 200) return [res.status, '']
  return [res.status, await res.json()]
}

export async function userLogin(userName, password) {
  const res = await fetch(url + 'login', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

// TODO use get
export async function getUserChatByRoom(userName) {
  const res = await fetch(url + 'getUsersChatByRoom', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName })
  })
  return await res.json()
}
