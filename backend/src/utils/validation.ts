import { RegisterUserInput, UpdateUserInput } from '../types/params'
import validator from 'validator'

const usernameErrors = (username: string) => {
  const errors: string[] = []
  if (username.length === 0) {
    errors.push('Username can not be empty')
  }
  return errors
}

const passwordErrors = (password: string | null) => {
  if (password === null) return []
  const errors: string[] = []

  if (password.length === 0) {
    errors.push('Password can not be empty')
  }
  if (password.length < 8) {
    errors.push('Password is too short, min. 8 characters')
  }
  if (
    !validator.matches(
      password,
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#$%^&*()]).{7,30}\S$/
    )
  ) {
    errors.push('Password must have at least one number, one uppercase character, lowercase  character and special character from !?@#$%^&*()')
  }
  return errors
}

const emailErrors = (email: string | null) => {
  if (email === null) return []
  const errors: string[] = []
  if (email.length === 0) {
    errors.push('Email can not be empty')
  }
  if (!validator.isEmail(email)) {
    errors.push('Please enter a valid email address')
  }
  return errors
}

export const validateUserArgs = ({
  username,
  password,
  email,
}: RegisterUserInput): { errorMessage: string, validationFailed: boolean } => {
  const errors = [...usernameErrors(username), ...passwordErrors(password), ...emailErrors(email)]
  if (errors.length > 0) {
    return { errorMessage: errors[0], validationFailed: true }
  }
  return { errorMessage: 'Registeration successfull!', validationFailed: false }
}

export const validateUserUpdateArgs = ({
  username,
  newPassword,
  newEmail,
}: UpdateUserInput): { errorMessage: string, validationFailed: boolean } => {
  const errors = [...usernameErrors(username), ...passwordErrors(newPassword), ...emailErrors(newEmail)]
  if (errors.length > 0) {
    return { errorMessage: errors[0], validationFailed: true }
  }
  return { errorMessage: 'Update successfull!', validationFailed: false }
}
