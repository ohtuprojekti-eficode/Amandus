import React, { useState } from 'react'
import { Formik, Form, FormikProps } from 'formik'
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
} from '@material-ui/core'
import { useMutation } from '@apollo/client'
import { LOGIN, REGISTER } from '../graphql/mutations'
import RegisterSchema from './RegisterSchema'

const stylesInUse = makeStyles((theme) =>
  createStyles({
    root: {
      maxWidth: '500px',
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
    successMessage: { color: theme.palette.success.main },
    errorMessage: { color: theme.palette.error.main },
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
  duplicate: {
    message: 'Username already exists',
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

  const [registerUser] = useMutation(REGISTER)
  const [loginUser] = useMutation(LOGIN)

  const logInUser = async (data: MyRegisterForm) => {
    try {
      const loginResponse = await loginUser({
        variables: {
          username: data.username,
          password: data.password,
        },
      })
      setFormStatus(formStatusProps.success)
      localStorage.setItem('token', loginResponse.data.login)
      window.location.href = '/'
    } catch (error) {
      setFormStatus(formStatusProps.error)
    }
  }

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
      setFormStatus(formStatusProps.success)
      await logInUser(data)
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        setFormStatus(formStatusProps.duplicate)
      } else {
        setFormStatus(formStatusProps.error)
      }
    }
    resetForm({})
    setShowFormStatus(true)
  }

  const UserSchema = RegisterSchema

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
              <Grid container direction="row">
                <Grid item className={classes.title} xs={12}>
                  <h1>Register</h1>
                </Grid>

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
                        ? 'Valid password is atleast 7 characters long and consists atleast 1 uppercase,lowercase,number and special character.'
                        : 'Make sure your password includes no spaces, is minimum 7 characters long and consists at least 1 uppercase,lowercase,number and special character.'
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
                        ? 'Valid password is atleast 7 characters long and consists atleast 1 uppercase,lowercase,number and special character.'
                        : 'Make sure your password includes no spaces, is minimum 7 characters long and consists at least 1 uppercase,lowercase,number and special character.'
                    }
                    error={
                      touched.confirmPassword && errors.confirmPassword
                        ? true
                        : false
                    }
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
