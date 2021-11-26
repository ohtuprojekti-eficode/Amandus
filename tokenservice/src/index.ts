import express from 'express'
import tokenRouter from './routes/tokenRouter'
import cors from 'cors'
import config from './utils/config'
import tokenService from './services/tokenService'
const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/tokens', tokenRouter)

if (process.env.NODE_ENV === 'e2etest') {
  app.post('/reset', (_req, res) => {
    tokenService.clearStorage()
    res.status(204).send()
  })
}

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})