
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
}
