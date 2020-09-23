import express from 'express'
const app = express()
app.use(express.json())

app.get('/', (_req, res) => {
    res.send('<h1>Hello World!</h1>')
})
console.log('hello world')


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})