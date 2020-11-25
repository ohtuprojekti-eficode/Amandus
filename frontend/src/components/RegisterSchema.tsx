//import React from 'react'
import * as Yup from 'yup'

const RegisterSchema = () => {
  return Yup.object().shape({
    email: Yup.string().email().required('Email address is mandatory.'),
    username: Yup.string()
      .required('Please choose your username.')
      .min(3, 'Username must be at least 3 characters long.')
      .max(50, 'Username can be maximum 50 characters long.')
      .required('Username is mandatory.'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters long.')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!?@#$%^&*()]).{7,30}\S$/
      )
      .required(
        'Password must have at least one number, one uppercase character, lowercase  character and special character from !?@#$%^&*() '
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match.')
      .required('Passwords must match.'),
  })
}

export default RegisterSchema
