import { RegisterUserInput } from '../types/params'
import validator from 'validator'

export const validateUserArgs = ({
  username,
  password,
  email,
}: RegisterUserInput) => {
  var errorMessage = 'Registration succcessful!'
  var validationFailed = false

  // Username Validation
  if (username.length === 0 || password.length === 0 || email.length === 0) {
    return {
      errorMessage: 'Username, email or password can not be empty',
      validationFailed: true,
    }
  }

  // Password Validation
  if (password.length < 8) {
    return {
      errorMessage: 'Password is too short, min. 8 characters',
      validationFailed: true,
    }
  }

  if (
    !validator.matches(
      password,
      '/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#$%^&*()]).{7,30}S$/'
    )
  ) {
    return {
      errorMessage:
        'Password must have at least one number, one uppercase character, lowercase  character and special character from !?@#$%^&*()',
      validationFailed: true,
    }
  }

  // Email Validation
  if (!validator.isEmail(email)) {
    return {
      errorMessage: 'Please enter a valid email address',
      validationFailed: true,
    }
  }

  return { errorMessage, validationFailed }
}
