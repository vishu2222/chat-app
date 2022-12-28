app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hasherPassword = await bcrypt.hash(req.body.password, salt)
    const user = { name: req.body.name, password: hasherPassword }
    users.push(user)
    res.sendStatus(200)
  } catch {
    res.sendStatus(500)
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name))
  if (user === null) return res.sendStatus(400)
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.sendStatus(200).send('success')
    } else {
      res.send('not allowed')
    }
  } catch {}
})

// salt rounds read
// https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt

// https://openbase.com/js/bcrypt/documentation
