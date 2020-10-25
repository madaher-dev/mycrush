import React, { useEffect } from 'react';
import { setAlert } from '../../actions/alertActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  registerUser,
  clearErrors,
  setLoading
} from '../../actions/userActions';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { TextField } from 'formik-material-ui';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const Register = ({
  registerUser,
  isAuthenticated,
  error,
  clearErrors,
  setAlert,
  user,
  setLoading,
  loading
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  if (isAuthenticated) {
    return <Redirect to="/welcome" />;
  } else if (user) {
    if (!user.email_confirmed) return <Redirect to="/notconfirmed" />;
  } else {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid
          item
          container
          xs={12}
          sm={4}
          className={classes.main}
          alignItems="center"
          justify="center"
        >
          <Typography>
            My Crush allows you to connect with your secret admireres. Your
            crushes can search for you by Name, Phone, or various social media
            platforms.
          </Typography>
          <Grid item xs={12} sm={8}>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                passwordConfirm: ''
              }}
              validate={values => {
                const errors = {};
                if (!values.name) {
                  errors.name = 'Please enter your name';
                }
                if (!values.email) {
                  errors.email = 'Please enter a valid email';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.email
                  )
                ) {
                  errors.email = 'Invalid email address';
                }
                if (!values.password) {
                  errors.password = 'Please enter a password';
                } else if (values.password.length < 8) {
                  errors.password = 'Password should be at least 8 characters';
                }
                if (values.password !== values.passwordConfirm) {
                  errors.passwordConfirm = 'Passwords do not match!';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  setSubmitting(false);
                  setLoading();
                  registerUser(values);
                }, 500);
              }}
            >
              {({ submitForm, isSubmitting, touched, errors }) => (
                <Form>
                  <Box margin={1}>
                    <Field
                      component={TextField}
                      name="name"
                      type="text"
                      label="Name"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box margin={1}>
                    <Field
                      component={TextField}
                      name="email"
                      type="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box margin={1}>
                    <Field
                      component={TextField}
                      type="password"
                      label="Password"
                      name="password"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                  <Box margin={1}>
                    <Field
                      component={TextField}
                      type="password"
                      label="Confirm Password"
                      name="passwordConfirm"
                      variant="outlined"
                      fullWidth
                    />
                  </Box>

                  <Box margin={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      Signup
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
            <Backdrop className={classes.backdrop} open={loading}>
              <CircularProgress color="primary" />
            </Backdrop>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string,
  user: PropTypes.object,
  setAlert: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error,
  user: state.users.user,
  loading: state.users.loading
});

export default connect(mapStateToProps, {
  registerUser,
  clearErrors,
  setAlert,
  setLoading
})(Register);
