import express from 'express'
import tokenService from '../services/tokenService'
import { RequestParams } from '../types'

import toValidRequest from '../utils/utils'

const router = express.Router()

router.post('/', (req, res) => {
  try {
    const { amandusToken, serviceName, serviceToken }: RequestParams = toValidRequest(req)
    tokenService.setToken(amandusToken, serviceName, serviceToken)
    res.status(200).send()
  } catch (e) {
    res.status(400).send((e as Error).message)
  }
})

export default router