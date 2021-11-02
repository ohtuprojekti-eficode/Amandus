import express from 'express'
import tokenService from '../services/tokenService'
import { RequestContent, PostRequestContent } from '../types'
import { toValidPostRequest, toValidRequest, toAmandusToken } from '../utils/validator'

const router = express.Router()

router.post('/:id', (req, res) => {
  const id = Number(req.params.id)
  const { amandusToken, serviceName, serviceToken }: PostRequestContent = toValidPostRequest(req)

  try {
    tokenService.setToken(amandusToken, serviceName, serviceToken, id)
    res.status(200).send('new token set')
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.get('/:id/:service', (req, res) => {
  const id = Number(req.params.id)
  const { amandusToken, serviceName }: RequestContent = toValidRequest(req)

  tokenService.getAccessToken(amandusToken, serviceName, id)
    .then(token => {
      token ? res.json({ 'access_token': token }) : res.status(404).send('token not found')
    }).catch((e) => {
      res.status(404).send((e as Error).message)
    })
})

router.delete('/:id/:service', (req, res) => {
  const id = Number(req.params.id)
  const { amandusToken, serviceName }: RequestContent = toValidRequest(req)

  try {
    tokenService.removeToken(amandusToken, serviceName, id)
    res.status(200).send('token removed succesfully')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  try {
    const amandusToken: string = toAmandusToken(req)
    tokenService.removeUser(amandusToken, id)
    res.status(200).send('user data succesfully removed')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

export default router