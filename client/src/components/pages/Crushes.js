import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertActions';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { TextField } from 'formik-material-ui';
import Box from '@material-ui/core/Box';
import { Formik, Form, Field } from 'formik';
import { Button, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  addCrush,
  getCrushes,
  clearErrors,
  setLoading
} from '../../actions/crushActions';
import { setPage } from '../../actions/userActions';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import CommentIcon from '@material-ui/icons/Comment';
import CrushCard from './CrushCard';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hooray from './Hooray';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingBottom: 100
  },

  fb: {
    color: '#3b5998'
  },
  phone: {
    color: '#34B7F1'
  },
  twitter: {
    color: '#00acee'
  },
  insta: {
    color: '#C13584'
  },
  list: {
    paddingTop: 20
  },
  cancel: {
    marginLeft: 20
  }
}));

const Crushes = ({
  addCrush,
  getCrushes,
  loading,
  crushes,
  added,
  error,
  clearErrors,
  setAlert,
  setLoading,
  match1,
  current,
  user,
  crushesLoaded,
  setPage,
  location
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (!crushesLoaded) {
      setLoading();
      getCrushes();
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (added) setAdd(false);
  }, [added]);

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const [add, setAdd] = useState(false);

  useEffect(() => {
    if (!add) setPage('Crushes');

    // eslint-disable-next-line
  }, [add]);

  const handleAdd = () => {
    setAdd(true);
    setPage('Add Crush');
  };

  const handleCancel = () => {
    setAdd(false);
  };

  const handleClose = () => {
    return <Redirect to="/matches" />;
  };

  if (location.addOpen && !add) {
    handleAdd();
    location.addOpen = false;
  }

  const addView = (
    <Grid item container xs={12} sm={6} justify="center">
      <Typography>
        Add the fields that you know about your Crush. You will be matched with
        any network they have verified!
      </Typography>
      <Grid item xs={12} sm={6}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            twitter: '',
            facebook: '',
            instagram: ''
          }}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Please enter your crush name';
            }
            if (values.name.length < 5) {
              errors.name = 'Name must be at least 5 characters';
            }
            if (values.email) {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
            }
            //validate social media

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false);
              addCrush(values);
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
                  label="Crush Name"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CommentIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="email"
                  type="email"
                  label="Crush Email"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="secondary" />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="phone"
                  type="number"
                  label="Crush Phone Number"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon className={classes.phone} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="twitter"
                  type="text"
                  label="Crush Twitter Account"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TwitterIcon className={classes.twitter} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="facebook"
                  type="text"
                  label="Crush Facebook Account"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FacebookIcon className={classes.fb} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="instagram"
                  type="text"
                  label="Crush Instagram Account"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InstagramIcon className={classes.insta} />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <Box margin={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Add Crush
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className={classes.cancel}
                >
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
  const listView = (
    <Grid item container xs={11} sm={6} alignItems="center" justify="center">
      <Typography>
        Click on the <AddCircleOutlineIcon /> Button to add a new Crush. Your
        crush will be notified that they have a secret crush but will never know
        who it is unless you both match. Happy Crushing!
      </Typography>

      {crushes !== [] && !loading ? (
        <Grid
          item
          container
          spacing={2}
          // direction="column"
          justify="center"
          className={classes.list}
          // alignItems="center"
        >
          {crushes.map(crush => (
            //Looping through Crushes array and list Crush Item Component

            <Grid item key={crush._id}>
              <CrushCard crush={crush} />
            </Grid>
          ))}
        </Grid>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <Fragment />
      )}
    </Grid>
  );
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.main}
    >
      {add ? addView : listView}
      <Dialog
        open={match1}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {`It's A Match!`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {current ? current.sourceId : <Fragment />}
          </DialogContentText>
          <Hooray match={current} userId={user._id}></Hooray>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hooray!
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

Crushes.propTypes = {
  crushes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  addCrush: PropTypes.func.isRequired,
  getCrushes: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  clearErrors: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
  match1: PropTypes.bool,
  current: PropTypes.object,
  crushesLoaded: PropTypes.bool.isRequired,
  setPage: PropTypes.func.isRequired,
  addAction: PropTypes.bool
};

const mapStateToProps = state => ({
  crushes: state.crushes.crushes,
  loading: state.crushes.loading,
  added: state.crushes.added,
  error: state.crushes.error,
  match1: state.crushes.match,
  current: state.crushes.current,
  user: state.users.user,
  crushesLoaded: state.crushes.crushesLoaded
});

export default connect(mapStateToProps, {
  addCrush,
  getCrushes,
  clearErrors,
  setAlert,
  setLoading,
  setPage
})(Crushes);
