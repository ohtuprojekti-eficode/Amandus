import { pool } from '../db/connect'
import { Service } from '../types/service'

const getServiceByName = async (name: string): Promise<Service> => {
  const selectQuery = 'SELECT id, name FROM SERVICES WHERE name = $1'
  const result = await pool.query<Service>(selectQuery, [name])
  return result.rows[0]
}

export default {
  getServiceByName,
}
