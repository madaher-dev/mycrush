import React, { useEffect } from 'react';
import { setAlert } from '../../actions/alertActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  registerUser,
  checkUser,
  clearErrors,
  setLoading,
  checkFB
} from '../../actions/userActions';
import { Redirect, Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Avatar from '@material-ui/core/Avatar';
import { TextField } from 'formik-material-ui';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterLogin from 'react-twitter-auth';
import TwitterIcon from '@material-ui/icons/Twitter';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 100
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  forgotLink: {
    alignSelf: 'flex-end'
  },
  loginButton: {
    flexGrow: 1
  },
  social: {
    padding: 5
  },
  avatar: {
    // backgroundColor: red[500]
    backgroundColor: '#e91e63',
    marginTop: 20,
    marginBottom: 20
  },
  fbButton: {
    backgroundColor: '#4267B2',
    width: '100%'
  },
  twButton: {
    width: '100%',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    // marginTop: 10,
    backgroundColor: '#1DA1F2',
    transition: 'ease',
    '&:hover': {
      backgroundColor: '#AAB8C2'
    },

    '&:disabled': {
      cursor: 'default',
      opacity: 1
    },
    color: 'white',
    borderRadius: 5,
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: 'lightgray'
  },
  twIcon: {
    padding: 3
  }
}));

const Register = ({
  registerUser,
  checkUser,
  isAuthenticated,
  error,
  clearErrors,
  setAlert,
  user,
  setLoading,
  loading,
  checkFB
}) => {
  const classes = useStyles();
  const responseFacebook = response => {
    checkFB(response);
  };
  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const twitterOnFailed = response => {
    console.log('fail:', response);
  };

  const twitterOnSuccess = response => {
    if (response.ok) checkUser();
  };

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
          sm={5}
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
                    <Grid container>
                      <Grid item className={classes.loginButton}>
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          onClick={submitForm}
                        >
                          Signup
                        </Button>
                      </Grid>
                      <Grid item className={classes.forgotLink}>
                        <Typography>
                          <Link to="/login">Have an Account? Login here</Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Form>
              )}
            </Formik>
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
          <Grid item xs={12} sm={8} className={classes.social}>
            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              fields="name,email,picture, link"
              scope="public_profile, user_link"
              authType="https"
              //redirectUri="https://mycrushapp.herokuapp.com/register"
              isMobile={false}
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
                  Signup with Facebook
                </Button>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8} className={classes.social}>
            <TwitterLogin
              loginUrl="https://mycrushapp.herokuapp.com/api/v1/networks/twitter"
              onFailure={twitterOnFailed}
              onSuccess={twitterOnSuccess}
              requestTokenUrl="https://mycrushapp.herokuapp.com/api/v1/networks/twitter/reverse"
              className={classes.twButton}
              showIcon={false}
            >
              <TwitterIcon className={classes.twIcon} />
              <span> Signup with Twitter</span>
            </TwitterLogin>
          </Grid>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="primary" />
          </Backdrop>
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
  loading: PropTypes.bool.isRequired,
  checkFB: PropTypes.func.isRequired,
  checkUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error,
  user: state.users.user,
  loading: state.users.loading
});

export default connect(mapStateToProps, {
  registerUser,
  checkUser,
  clearErrors,
  setAlert,
  setLoading,
  checkFB
})(Register);
