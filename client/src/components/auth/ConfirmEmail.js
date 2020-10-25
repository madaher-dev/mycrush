import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams, Redirect } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { confirmEmail, resetPass, setLoading } from '../../actions/userActions';
import Box from '@material-ui/core/Box';
import { TextField } from 'formik-material-ui';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(2)
    }
  },
  main: {
    paddingTop: 20
  },

  text: {
    textAlign: 'center'
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(20)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const ConfirmEmail = ({
  confirmEmail,
  setLoading,
  isAuthenticated,
  loading,
  error
}) => {
  // Pull Token from URL
  let { email_token } = useParams();

  // Check Token on load
  useEffect(() => {
    setLoading();
    confirmEmail(email_token);
  }, [email_token, setLoading, confirmEmail]);

  const classes = useStyles();

  const errorPage = <Redirect to="/login" />;

  // Form page if token is correct

  if (isAuthenticated) {
    return <Redirect to="/welcome" />;
  }
  if (error) return <Redirect to="/login" />;
  else {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.main}
      >
        {/* {error ? errorPage : formPage} */}
      </Grid>
    );
  }
};

ConfirmEmail.propTypes = {
  confirmEmail: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.users.user,
  loading: state.users.loading,
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error
});

export default connect(mapStateToProps, {
  confirmEmail,
  setLoading
})(ConfirmEmail);
