import express from 'express'
import tokenService from '../services/tokenService'
import { toAmandusToken } from '../utils/validator'

const router = express.Router()

router.delete('/', (req, res) => {
  try {
    const amandusToken: string = toAmandusToken(req)
    tokenService.removeUser(amandusToken)
    res.status(200).send('user data succesfully removed')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

export default router