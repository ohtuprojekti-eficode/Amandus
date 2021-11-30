import { readFileSync } from 'fs'

export const readSettings = (): string => {
  const settings = readFileSync('src/utils/settings.json', { encoding:'utf8', flag:'r' } )
  return settings
}
