export const sanitizeCommitMessage = (inputStr: string):string => {
  let str = inputStr.trim()
  str = stripDangerousSpecialChars(str)
  str = stripConsecutiveSpecialChars(str)
  return str
}
  
export const sanitizeBranchName = (inputStr: string):string => {
  // Rules for branch names: https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-check-ref-format.html
  let str = inputStr.trim()
  str = stripAllSpecialCharsButDash(str)
  str = stripConsecutiveSpecialChars(str)
  str = stripStartingDashFromString(str)
  return str
}
  
const stripDangerousSpecialChars = (str: string):string => {
  return str.replace(/[^a-zA-Z0-9\s+-.,?!]/g, '')
}
  
const stripConsecutiveSpecialChars = (str: string):string => {
  return str.replace(/(\W)\1+/g, '$1')
}
  
const stripAllSpecialCharsButDash = (str: string):string => {
  return str.replace(/[^a-zA-Z0-9-]/g, '')
} 
  
const stripStartingDashFromString = (str: string):string => {
  return str.replace(/^-/, '')
}