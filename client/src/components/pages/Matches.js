import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { getMatches, setLoading } from '../../actions/matchActions';
import MatchCard from './MatchCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingBottom: 100
  }
}));

const Matches = ({
  getMatches,
  setLoading,
  matches,
  loading,
  user,
  matchesLoaded
}) => {
  const classes = useStyles();
  useEffect(() => {
    if (!matchesLoaded) {
      setLoading();
      getMatches();
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.main}
    >
      <Grid item container xs={11} sm={6} alignItems="center" justify="center">
        {matches.length > 0 && !loading ? (
          <Grid
            item
            container
            spacing={2}
            // direction="column"
            justify="center"
            // alignItems="center"
          >
            <Typography>Happy Matching!</Typography>
            {matches.map(match => (
              //Looping through matches array and list Match Item Component

              <Grid item key={match._id}>
                <MatchCard match={match} userId={user._id} />
              </Grid>
            ))}
          </Grid>
        ) : loading ? (
          <CircularProgress />
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">
              You do not have any Matches. Go to the{' '}
              <Link
                style={{ color: 'inherit', textDecoration: 'underline' }}
                to={'/crushes'}
              >
                Crushes
              </Link>{' '}
              Page and add more Crushes to increase your chance of a Match!
            </Alert>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

Matches.propTypes = {
  matches: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getMatches: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired,
  user: PropTypes.object,
  matchesLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  matches: state.matches.matches,
  loading: state.matches.loading,
  error: state.matches.error,
  user: state.users.user,
  matchesLoaded: state.matches.matchesLoaded
});

export default connect(mapStateToProps, {
  getMatches,
  setLoading
})(Matches);
