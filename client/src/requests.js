
const url = 'http://localhost:3000/'

export async function checkUserNameExists(userName) {
    const res = await fetch(url + 'checkUser', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ userName })
    });
    // console.log(await res.json())
    return await res.json()
}

export async function signupUser(userName, password) {
    const res = await fetch(url + 'signUp', {
        headers: { 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ userName, password })
    })
    return await res.json() // TODO
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
