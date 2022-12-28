const url = 'http://localhost:3000/'

export async function checkUserNameExists(userName) {
  const res = await fetch(url + 'checkUser', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName })
  })
  return await res.json()
}

export async function signupUser(userName, password) {
  const res = await fetch(url + 'signUp', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  return res.status
}

export async function getToken(userName) {
  //   const res = await fetch(url + 'getToken', { credentials: 'include' }) // include: allow send or recieve cookies for cross-origin requists
  //   const cookies = new Cookies()
  //   console.log(cookies.get('token'))
}

// include: allow send or recieve cookies for cross-origin requists
export async function authenticate(userName) {
  const res = await fetch(url + 'authenticate', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName })
  })
  return await res.json()
}

export async function userLogin(userName, password) {
  const res = await fetch(url + 'login', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userName, password })
  })
  const status = res.status
  //   console.log(status)
  return status
}
