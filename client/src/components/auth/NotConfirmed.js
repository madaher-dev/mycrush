import React, { useEffect } from 'react';
import { setAlert } from '../../actions/alertActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  clearErrors,
  setLoading,
  resendEmail
} from '../../actions/userActions';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  },
  forgotLink: {
    alignSelf: 'flex-end'
  },
  loginButton: {
    flexGrow: 1
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const NotConfirmed = ({
  isAuthenticated,
  error,
  clearErrors,
  setAlert,
  setLoading,
  loading,
  resendEmail,
  user,
  sent
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const sendEmail = e => {
    e.preventDefault();
    setLoading();
    resendEmail(user.email);
  };

  if (isAuthenticated) {
    return <Redirect to="/welcome" />;
  } else if (user) {
    if (!user.email_confirmed) {
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
              Welcome {user.email} Please confirm your email to login! If you
              did not receive an email from us you can try again.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              disabled={sent}
              onClick={sendEmail}
            >
              Send Again
            </Button>
          </Grid>
          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="primary" />
          </Backdrop>
        </Grid>
      );
    } else return <Redirect to="/welcome" />;
  } else return <Redirect to="/login" />;
};
NotConfirmed.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string,
  setAlert: PropTypes.func.isRequired,
  user: PropTypes.object,
  sent: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  resendEmail: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error,
  user: state.users.user,
  sent: state.users.emailSent,
  loading: state.users.loading
});

export default connect(mapStateToProps, {
  clearErrors,
  setAlert,
  setLoading,
  resendEmail
})(NotConfirmed);
