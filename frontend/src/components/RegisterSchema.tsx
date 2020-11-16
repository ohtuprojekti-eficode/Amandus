//import React from 'react'
import * as Yup from 'yup'

  const RegisterSchema = () => {
      
      return(
      Yup.object().shape({
    email: Yup.string().email().required('Enter your email'),
    username: Yup.string()
      .required('Please choose your username')
      .min(3, 'username must be at least 3 characters long')
      .max(50, 'username can be maximum 50 characters long')
      .required('Username is mandatory'),
    password: Yup.string()
      .min(6, 'password must be at least 6 characters long')
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{6,25}\S$/)
      .required(
        'Please choose your password. Atleast one uppercase, one lowercase, one special character, one number and no spaces'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Password confirm is required'),
  })
      )}

  export default RegisterSchema
