import express from 'express'
import tokenService from '../services/tokenService'
import {
  parseDeleteTokenRequest,
  parseGetRequest,
  parsePostRequest,
  parseDeleteUserRequest
} from '../utils/validator'

const router = express.Router()

router.post('/:id/:service', (req, res) => {
  try {
    const { id, serviceName, amandusToken, serviceToken } = parsePostRequest(req)
    tokenService.setToken(amandusToken, serviceName, serviceToken, id)
    res.json({ msg: 'new token set' })
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.get('/:id/:service', (req, res) => {
  try {
    const { id, serviceName, amandusToken, queryType } = parseGetRequest(req)

    if (queryType === 'state') {
      const serviceIsConnected = tokenService.isServiceConnected(id, serviceName, amandusToken)
      res.json({ 'connected': serviceIsConnected })
    }

    if (queryType === 'token') {
      tokenService.getAccessToken(amandusToken, serviceName, id)
        .then(token => {
          token
            ? res.json({ 'access_token': token })
            : res.status(404).send('token not found')
        }).catch((e) => {
          res.status(404).send((e as Error).message)
        })
    }
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.delete('/:id/:service', (req, res) => {
  try {
    const { id, serviceName, amandusToken } = parseDeleteTokenRequest(req)

    tokenService.removeToken(amandusToken, serviceName, id)
    res.json({ removed: true })
  } catch (e) {
    const { name, message } = e as Error

    name === 'TypeError' || name === 'JsonWebTokenError'
      ? res.status(400).send(message)
      : res.status(404).send(message)
  }
})

router.delete('/:id', (req, res) => {
  try {
    const { id, amandusToken } = parseDeleteUserRequest(req)

    tokenService.removeUser(amandusToken, id)
    res.json({ removed: true })
  } catch (e) {
    const { name, message } = e as Error

    name === 'TypeError' || name === 'JsonWebTokenError'
      ? res.status(400).send(message)
      : res.status(404).send(message)
  }
})

export default router