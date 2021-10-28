import express from 'express'
const app = express()

let tokens = [
  {id: 1, token: 'a'},
  {id: 2, token: 'b'},
  {id: 3, token: 'c'},
  {id: 4, token: 'd'}
]

app.get('/', (_req, res) => {
  res.send('<H1>Token service<H1>')
})

app.get('/api/tokens', (_req, res) => {
  res.json(tokens)
})

app.get('/api/tokens/:id', (req, res) => {
  const id = Number(req.params.id)

  const token = tokens.find(t => t.id === id)

  if(token) {
    res.json(token)
  } else {
    res.status(404).end
  }
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})