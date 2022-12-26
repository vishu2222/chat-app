require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.userName === req.user.name))
})

app.post('/login', (req, res) => {
    // authenticate

    const userName = req.body.userName;
    const user = { user: userName }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})


function authenticateToken(req, res, next) {
    const authHeadder = req.headders['authorization']
    const token = authHeadder && authHeadder.split(' ')[1]
    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)



// requests

POST http://localhost:3000/login
Content - Type: application / json
{
    "userName": "user1"
}

GET http://localhost:3000/posts
Authorization: Bearer
xxxxx.yyyyyy.zzzzzz