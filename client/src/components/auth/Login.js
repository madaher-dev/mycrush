import React, { useEffect } from 'react';
import { setAlert } from '../../actions/alertActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loginUser, clearErrors, checkFB } from '../../actions/userActions';
import { Redirect, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import Box from '@material-ui/core/Box';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Avatar from '@material-ui/core/Avatar';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 100
  },
  forgotLink: {
    alignSelf: 'flex-end'
  },
  loginButton: {
    flexGrow: 1
  },
  social: {
    padding: 10
  },
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63',
    marginTop: 20,
    marginBottom: 20
  },
  form: {
    paddingTop: 20
  },
  fbButton: {
    backgroundColor: '#4267B2',
    width: '100%'
  }
}));

//console.log(process.env.NODE_ENV);
const Login = ({
  loginUser,
  isAuthenticated,
  error,
  clearErrors,
  setAlert,
  user,
  checkFB
}) => {
  const classes = useStyles();

  const responseFacebook = response => {
    //console.log(response);
    checkFB(response);
  };

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  if (isAuthenticated) {
    return <Redirect to="/welcome" />;
  } else if (user && !user.email_confirmed) {
    return <Redirect to="/notconfirmed" />;
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
            MyCrush allows you to connect with your secret admirers. Your
            crushes can search for you by Name, Phone, or various social media
            platforms.
          </Typography>
          <Grid item xs={12} sm={8} className={classes.form}>
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validate={values => {
                const errors = {};

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

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  setSubmitting(false);
                  loginUser(values);
                }, 500);
              }}
            >
              {({ submitForm, isSubmitting, touched, errors }) => (
                <Form>
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
                    <Grid container>
                      <Grid item className={classes.loginButton}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          onClick={submitForm}
                        >
                          Login
                        </Button>
                      </Grid>
                      <Grid item className={classes.forgotLink}>
                        <Typography>
                          <Link to="/forgot">Forgot Password?</Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box margin={1}>
              <Grid container>
                <Grid item className={classes.loginButton}>
                  <Typography>Dont Have an account?</Typography>
                </Grid>
                <Grid item className={classes.forgotLink}>
                  <Typography>
                    <Link to="/register">Signup Now</Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={8}
            alignItems="center"
            justify="center"
          >
            <Avatar className={classes.avatar}>OR</Avatar>
          </Grid>
          <Grid item xs={12} sm={8}>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              fields="name,email,picture, link"
              scope="public_profile, user_link"
              //autoLoad
              callback={responseFacebook}
              render={renderProps => (
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={isSubmitting}
                  onClick={renderProps.onClick}
                  className={classes.fbButton}
                  startIcon={<FacebookIcon />}
                >
                  Login with Facebook
                </Button>
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string,
  setAlert: PropTypes.func.isRequired,
  user: PropTypes.object,
  checkFB: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error,
  user: state.users.user
});

export default connect(mapStateToProps, {
  loginUser,
  clearErrors,
  setAlert,
  checkFB
})(Login);
