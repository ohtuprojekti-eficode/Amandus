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
import { LOGIN } from '../graphql/mutations'

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
    loginButton: {
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

interface LoginFormFields {
  username: string
  password: string
}

const formStatusProps: MyFormStatusProps = {
  error: {
    message: 'Login failed. Please try again.',
    type: 'error',
  },
  success: {
    message: 'Login successful.',
    type: 'success',
  },
}

const MyLoginForm = () => {
  const [formStatus, setFormStatus] = useState<MyFormStatus>({
    message: '',
    type: '',
  })
  const classes = stylesInUse()
  const [showFormStatus, setShowFormStatus] = useState(false)

  const [loginUser] = useMutation(LOGIN)

  const logInUser = async (data: LoginFormFields, resetForm: Function) => {
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

    resetForm({})
    setShowFormStatus(true)
  }

  const UserSchema = Yup.object().shape({
    username: Yup.string().required('Please enter your username.'),
    password: Yup.string().required('Please enter your password.'),
  })

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={(values: LoginFormFields, actions) => {
          logInUser(values, actions.resetForm)
          setTimeout(() => {
            actions.setSubmitting(false)
          }, 400)
        }}
        validationSchema={UserSchema}
      >
        {(props: FormikProps<LoginFormFields>) => {
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
                  <h1>Login</h1>
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
                        : 'Please enter your username.'
                    }
                    error={touched.username && errors.username ? true : false}
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
                        ? errors.password
                        : 'Please enter your password.'
                    }
                    error={touched.password && errors.password ? true : false}
                  />
                </Grid>

                <Grid item className={classes.loginButton} xs={6}>
                  <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {' '}
                    Log in
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

export default MyLoginForm
