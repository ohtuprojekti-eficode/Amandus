import express from 'express'
import tokenService from '../services/tokenService'
import { RequestContent, PostRequestContent } from '../types'

import { toValidPostRequest, toValidRequest } from '../utils/validator'

const router = express.Router()

router.post('/', (req, res) => {
  try {
    const { amandusToken, serviceName, serviceToken }: PostRequestContent = toValidPostRequest(req)
    tokenService.setToken(amandusToken, serviceName, serviceToken)
    res.status(200).send('new token set')
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.get('/', (req, res) => {
  const { amandusToken, serviceName }: RequestContent = toValidRequest(req)

  tokenService.getAccessToken(amandusToken, serviceName)
    .then(token => {
      token ? res.json({ 'access_token': token }) : res.status(404).send('token not found')
    }).catch((e) => {
      res.status(404).send((e as Error).message)
    })
})

router.delete('/', (req, res) => {
  const { amandusToken, serviceName }: RequestContent = toValidRequest(req)

  try {
    tokenService.removeToken(amandusToken, serviceName)
    res.status(200).send('token removed succesfully')
  } catch (e) {
    res.status(404).send((e as Error).message)
  }
})

export default router