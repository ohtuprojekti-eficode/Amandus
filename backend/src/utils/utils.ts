import { exec } from 'child_process'
import { promisify } from 'util'
const execProm = promisify(exec)

export const validateBranchName = async (branchName: string): Promise<void> => {
  await runShellCommand(`git check-ref-format --branch ${branchName}`)
}

const runShellCommand = async (command: string): Promise<string> => {
  try {
    return (await execProm(command)).stdout
  } catch (error) {
    throw new Error(error.message)
  }
}

export const sanitizeString = (inputStr: string):string => {
  let str = inputStr.trim()
  str = stripDangerousSpecialChars(str)
  str = stripConsecutiveSpecialChars(str)
  return str
}

const stripDangerousSpecialChars = (str: string):string => {
  return str.replace(/[^a-zA-Z0-9\s+-.,?!]/g, '')
}

const stripConsecutiveSpecialChars = (str: string):string => {
  return str.replace(/(\W)\1+/g, '$1')
}