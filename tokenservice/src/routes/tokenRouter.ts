import express from 'express'
import tokenService from '../services/tokenService'

import toNewToken from '../utils'

const router = express.Router()

router.get('/', (_req, res) => {
  res.send(tokenService.getTokens())
})

router.get('/:id', (req, res) => {
  const id = Number(req.params.id)
  const token = tokenService.findById(id)

  if (token) {
    res.send(token)
  } else {
    res.sendStatus(404)
  }
})

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newToken = toNewToken(req.body)
    const addedToken = tokenService.addToken(newToken)
    res.json(addedToken)
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const removed = tokenService.removeToken(id)
  if(removed){
    console.log(`Token for id${id} has been removed`)
  } else {
    res.sendStatus(404)
  }
})

export default router