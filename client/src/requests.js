
const url = 'http://localhost:3000/'

export async function checkUserNameExists(userName) {
    const res = await fetch(url + 'checkUser', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ userName })
    });
    return await res.json()
}

export async function signupUser(userName, password) {
    const res = await fetch(url + 'signUp', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ userName, password })
    })
    return res.status
}

export async function userLogin(userName, password) {
    const res = await fetch(url + 'signIn', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ userName, password })
    })
    const status = res.status
    return status
}
