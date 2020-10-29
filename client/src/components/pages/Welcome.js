import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import CrushesBox from './CrushesBox';
import MatchesBox from './MatchesBox';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'stretch',
    width: '100%'
  }
}));
const Welcome = ({ crushes, crushesLoaded, user }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" alignItems="center">
      <Grid
        container
        item
        xs={12}
        className={classes.main}
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12}>
          Welcome to MyCrush
        </Grid>
        {user && !user.facebook ? (
          <Grid item xs={12}>
            <Alert severity="info">
              Your facebook account is not connected! Go to{' '}
              <Link
                style={{ color: 'inherit', textDecoration: 'underline' }}
                to={'/verify'}
              >
                Networks
              </Link>{' '}
              and connect it to add your chances for a match!
            </Alert>
          </Grid>
        ) : (
          <Fragment />
        )}
        {crushesLoaded && crushes.length == 0 ? (
          <Grid item xs={12}>
            <Alert severity="warning">
              You do not have any Crushes. Go to the{' '}
              <Link
                style={{ color: 'inherit', textDecoration: 'underline' }}
                to={'/crushes'}
              >
                Crushes
              </Link>{' '}
              Page and create a new Crush Now! Your crush will only know about
              your feelings if you mutually have a crush!
            </Alert>
          </Grid>
        ) : (
          <Fragment />
        )}
        <Grid item xs={12} sm={4}>
          <CrushesBox />
        </Grid>
        <Grid item xs={12} sm={4}>
          <MatchesBox />
        </Grid>
      </Grid>
    </Grid>
  );
};

Welcome.propTypes = {
  crushes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  user: PropTypes.object,
  crushesLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  crushes: state.crushes.crushes,
  crushesLoaded: state.crushes.crushesLoaded,
  user: state.users.user
});

export default connect(mapStateToProps, {})(Welcome);
