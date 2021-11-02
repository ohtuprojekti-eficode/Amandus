import express from 'express'
import tokenService from '../services/tokenService'
import { GetRequestParams, PostRequestParams } from '../types'

import { toValidPostRequest, toValidGetRequest } from '../utils/validator'

const router = express.Router()

router.post('/', (req, res) => {
  try {
    const { amandusToken, serviceName, serviceToken }: PostRequestParams = toValidPostRequest(req)
    tokenService.setToken(amandusToken, serviceName, serviceToken)
    res.status(200).send()
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

router.get('/', (req, res) => {
  const { amandusToken, serviceName }: GetRequestParams = toValidGetRequest(req)

  tokenService.getAccessToken(amandusToken, serviceName)
    .then(token => {
      res.json({ 'access_token': token })
    }).catch((e) => {
      res.status(404).send((e as Error).message)
    })
})

export default router