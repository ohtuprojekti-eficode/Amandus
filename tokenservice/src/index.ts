import express from 'express'
import tokenRouter from './routes/tokenRouter'
import userRouter from './routes/userRouter'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/tokens', tokenRouter)
app.use('/api/users', userRouter)

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})