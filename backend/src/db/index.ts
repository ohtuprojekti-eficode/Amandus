import { connect } from './connect'

const pool = connect()

interface DB {
  query: any
}

export const db: DB = {
  query: (text: string, params: any) => {
    return pool.query(text, params)
  },
}
