import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik, Form, FormikProps } from 'formik'
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
} from '@material-ui/core'
import { useMutation } from '@apollo/client'
import { REGISTER } from '../graphql/mutations'

const stylesInUse = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: '500px',
      color: 'white',
      display: 'block',
      margin: '0 auto',
    },
    textField: {
      '& > *': {
        width: '100%',
      },
    },
    registerButton: {
      marginTop: '30px',
    },
    title: { textAlign: 'left' },
    successMessage: { color: 'green' },
    errorMessage: { color: 'red' },
  })
)

interface MyFormStatus {
  type: string
  message: string
}

interface MyFormStatusProps {
  [key: string]: MyFormStatus
}

interface MyRegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const formStatusProps: MyFormStatusProps = {
  error: {
    message: 'Registeration failed. Please try again.',
    type: 'error',
  },
  success: {
    message: 'Registered successfully.',
    type: 'success',
  },
  already_used: {
    message: 'Email already in use. Please use different email.',
    type: 'error',
  },
}

const RegisterForm = () => {
  const [formStatus, setFormStatus] = useState<MyFormStatus>({
    message: '',
    type: '',
  })
  const classes = stylesInUse()
  const [showFormStatus, setShowFormStatus] = useState(false)

  const [
    registerUser,
    { loading: registerLoading, data: registerData },
  ] = useMutation(REGISTER)

  const createNewAccount = async (
    data: MyRegisterForm,
    resetForm: Function
  ) => {
    try {
      await registerUser({
        variables: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      })
    } catch (error) {
      setFormStatus(formStatusProps.error)
    }
    console.log('register loading', registerLoading)
    console.log('register data', registerData)
    setFormStatus(formStatusProps.success)
    resetForm({})
    setShowFormStatus(true)
  }

  const UserSchema = Yup.object().shape({
    email: Yup.string().email().required('Enter unique email'),
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

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values: MyRegisterForm, actions) => {
          createNewAccount(values, actions.resetForm)
          setTimeout(() => {
            actions.setSubmitting(false)
          }, 400)
        }}
        validationSchema={UserSchema}
      >
        {(props: FormikProps<MyRegisterForm>) => {
          const {
            handleBlur,
            handleChange,
            values,
            isSubmitting,
            touched,
            errors,
          } = props

          return (
            <Form>
              <h1 className={classes.title}>Registeration</h1>
              <Grid container direction="row">
                <Grid item className={classes.textField} xs={8}>
                  <TextField
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      touched.username && errors.username
                        ? errors.username
                        : 'Enter your username.'
                    }
                    error={touched.username && errors.username ? true : false}
                  />
                </Grid>
                <Grid item className={classes.textField} xs={8}>
                  {' '}
                  <TextField
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      touched.email && errors.email
                        ? errors.email
                        : 'Enter your email-address.'
                    }
                    error={touched.email && errors.email ? true : false}
                  />
                </Grid>

                <Grid item className={classes.textField} xs={8}>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      touched.password && errors.password
                        ? 'Valid password is atleast 6 characters long and consists 1 uppercase, 1 lowercase and 1 number.'
                        : 'No spaces, at least 6 characters, 1 uppercase, 1 lowercase and 1 number.'
                    }
                    error={touched.password && errors.password ? true : false}
                  />
                </Grid>

                <Grid item className={classes.textField} xs={8}>
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                        ? 'Valid password is atleast 6 characters long and consists 1 uppercase, 1 lowercase and 1 number.'
                        : 'No spaces, at least 6 characters, 1 uppercase, 1 lowercase and 1 number.'
                    }
                    error={touched.confirmPassword && errors.confirmPassword ? true : false}
                  />
                </Grid>

                <Grid item className={classes.registerButton} xs={6}>
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {' '}
                    Register
                  </Button>
                  {showFormStatus && (
                    <div className="formStatus">
                      {formStatus.type === 'success' ? (
                        <p className={classes.successMessage}>
                          {formStatus.message}
                        </p>
                      ) : formStatus.type === 'error' ? (
                        <p className={classes.errorMessage}>
                          {formStatus.message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </Grid>
              </Grid>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

export default RegisterForm
