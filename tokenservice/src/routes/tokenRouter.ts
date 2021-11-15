import express from 'express'
import tokenService from '../services/tokenService'
import { parseDeleteRequest, parseGetRequest, parsePostRequest } from '../utils/validator'

const router = express.Router()

router.post('/:id/:service', (req, res) => {
  const { id, serviceName, amandusToken, serviceToken } = parsePostRequest(req)

  try {
    tokenService.setToken(amandusToken, serviceName, serviceToken, id)
    res.status(200).send('new token set')
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.get('/:id/:service', (req, res) => {
  const data = req.query.data
  const { id, serviceName, amandusToken } = parseGetRequest(req)

  if (!data) {
    res.status(400).send('invalid data query string')
  }

  if (data === 'state') {
    const serviceState = tokenService.isServiceConnected(id, serviceName, amandusToken)
    res.json({ 'connected': serviceState })
  }

  if (data === 'token') {
    tokenService.getAccessToken(amandusToken, serviceName, id)
      .then(token => {
        token ? res.json({ 'access_token': token }) : res.status(404).send('token not found')
      }).catch((e) => {
        res.status(404).send((e as Error).message)
      })
  }
})

router.delete('/:id/:service', (req, res) => {
  const { id, serviceName, amandusToken } = parseDeleteRequest(req)
  if (!serviceName) {
    throw new Error('service name missing')
  }

  try {
    tokenService.removeToken(amandusToken, serviceName, id)
    res.status(200).send('token removed succesfully')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

router.delete('/:id', (req, res) => {
  const { id, amandusToken } = parseDeleteRequest(req)

  try {
    tokenService.removeUser(amandusToken, id)
    res.status(200).send('user data succesfully removed')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

export default router