import express from 'express'
import tokenRouter from './routes/tokenRouter'
import cors from 'cors'
import config from './utils/config'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/tokens', tokenRouter)

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})