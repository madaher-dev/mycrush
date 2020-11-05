import React, { Fragment, useEffect } from 'react';
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
  setLoading,
  closeAddCrush
} from '../../actions/crushActions';
//import FacebookIcon from '@material-ui/icons/Facebook';
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
    // paddingBottom: 100,
    width: '100%'
    // paddingLeft: 20,
    // paddingRight: 20
  },
  root: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%'
    // paddingLeft: 20,
    // paddingRight: 20
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
    paddingTop: 20,
    width: '100%'
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
  error,
  clearErrors,
  setAlert,
  setLoading,
  match2,
  current,
  crushesLoaded,
  closeAddCrush,
  add
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
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const [hooray, setOpen] = React.useState(false);

  useEffect(() => {
    if (match2) {
      setOpen(true);
    }
  }, [match2, setOpen]);

  const handleCancel = () => {
    closeAddCrush();
  };

  // if (location.addOpen) {
  //   setAddCrush();
  //   // location.addOpen = false;
  // }

  // Close Hooray Match Popup
  const handleClose = () => {
    setOpen(false);
    return <Redirect to="/matches" />;
  };

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
            if (!values.email && !values.instagram && !values.phone) {
              errors.email = 'You need to enter at least one Network';
            }
            //  validate social media

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            addCrush(values);
            setTimeout(() => {
              setSubmitting(false);
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
                  // helperText="This is only a label. You will not be matched with your crush name!"
                  // placeholder="You will not be matched with your crush name!"
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
                  placeholder="@crushtwitter"
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
              {/* <Box margin={1}>
                <Field
                  component={TextField}
                  name="facebook"
                  placeholder="www.facebook.com/crushprofile"
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
              </Box> */}
              <Box margin={1}>
                <Field
                  component={TextField}
                  name="instagram"
                  placeholder="@crushinsta"
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
    <Grid container item xs={12} alignItems="center">
      <Grid item xs={12}>
        <Typography>
          Click on the <AddCircleOutlineIcon /> Button to add a new Crush. Your
          crush will be notified that they have a secret crush but will never
          know who it is unless you both match. Happy Crushing!
        </Typography>
      </Grid>
      {crushes !== [] && !loading ? (
        <Grid
          item
          xs={12}
          spacing={2}
          container
          direction="column"
          justify="center"
          className={classes.main}
          //className={classes.list}
          alignItems="center"
        >
          {crushes.map(crush => (
            //Looping through Crushes array and list Crush Item Component

            <Grid item xs={12} sm={6} key={crush._id} className={classes.main}>
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
      direction="column"
      alignItems="center"
      className={classes.root}
    >
      {add ? addView : listView}
      <Dialog
        open={hooray}
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
            {/* {current ? current.sourceId : <Fragment />} */}
          </DialogContentText>
          <Hooray match1={current}></Hooray>
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
  match2: PropTypes.bool,
  current: PropTypes.object,
  crushesLoaded: PropTypes.bool.isRequired,
  addAction: PropTypes.bool,
  closeAddCrush: PropTypes.func.isRequired,
  add: PropTypes.bool
};

const mapStateToProps = state => ({
  crushes: state.crushes.crushes,
  loading: state.crushes.loading,
  error: state.crushes.error,
  match2: state.crushes.match,
  current: state.crushes.current,
  crushesLoaded: state.crushes.crushesLoaded,
  add: state.crushes.addOpen
});

export default connect(mapStateToProps, {
  addCrush,
  getCrushes,
  clearErrors,
  setAlert,
  setLoading,
  closeAddCrush
})(Crushes);
