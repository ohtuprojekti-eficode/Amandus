import express from 'express'
import tokenRouter from './routes/tokenRouter'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/tokens', tokenRouter)

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})