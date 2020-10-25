import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertActions';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { TextField } from 'formik-material-ui';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik, Form, Field } from 'formik';
import { Button, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  addCrush,
  getCrushes,
  clearErrors,
  setLoading
} from '../../actions/crushActions';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import CommentIcon from '@material-ui/icons/Comment';
import CrushCard from './CrushCard';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
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
  addButton: {
    paddingRight: 40,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 60
    }
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
  setLoading
}) => {
  const classes = useStyles();
  useEffect(() => {
    setLoading();
    getCrushes();

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

  const handleAdd = () => {
    setAdd(true);
  };

  const handleCancel = () => {
    setAdd(false);
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
    <Grid item container xs={11} sm={6}>
      <Typography>
        Click on the <AddCircleOutlineIcon /> Button to add a new Crush. Your
        crush will be notified that they have a secret crush but will never know
        who it is unless you both match. Happy Crushing!
      </Typography>
      <Grid item container justify="flex-end">
        <Grid item className={classes.addButton}>
          <IconButton color="primary" onClick={handleAdd}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>

      {crushes !== [] && !loading ? (
        <Grid
          item
          container
          spacing={2}
          // direction="column"
          justify="center"
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
        <LinearProgress />
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
  setLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  crushes: state.crushes.crushes,
  loading: state.crushes.loading,
  added: state.crushes.added,
  error: state.crushes.error
});

export default connect(mapStateToProps, {
  addCrush,
  getCrushes,
  clearErrors,
  setAlert,
  setLoading
})(Crushes);
