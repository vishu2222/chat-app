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
  return res.status
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

export async function getChatByRoom() {
  const res = await fetch(url + 'getChatByRoom', {
    credentials: 'include'
  })
  return await res.json()
}
