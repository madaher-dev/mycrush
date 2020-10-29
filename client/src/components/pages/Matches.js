import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { getMatches, setLoading } from '../../actions/matchActions';
import MatchCard from './MatchCard';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  }
}));

const Matches = ({ getMatches, setLoading, matches, loading, user }) => {
  const classes = useStyles();
  useEffect(() => {
    setLoading();
    getMatches();

    // eslint-disable-next-line
  }, []);
  console.log(loading);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.main}
    >
      <Grid item container xs={11} sm={6}>
        <Typography>Happy Matching!</Typography>

        {matches !== [] && !loading ? (
          <Grid
            item
            container
            spacing={2}
            // direction="column"
            justify="center"
            // alignItems="center"
          >
            {/* {matches.map(match =>
              //Looping through matches array and list Match Item Component
              (match.sourceId = user._id) ? (
                <Grid item key={match._id}>
                  <MatchCard match={match} type={'sourceId'} />
                </Grid>
              ) : (
                <Grid item key={match._id} type={'targetId'}>
                  <MatchCard match={match} />
                </Grid>
              )
            )} */}
            {matches.map(match => (
              //Looping through matches array and list Match Item Component

              <Grid item key={match._id}>
                <MatchCard match={match} userId={user._id} />
              </Grid>
            ))}
          </Grid>
        ) : loading ? (
          <LinearProgress />
        ) : (
          <Fragment>Test</Fragment>
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
  user: PropTypes.object
};

const mapStateToProps = state => ({
  matches: state.matches.matches,
  loading: state.matches.loading,
  error: state.matches.error,
  user: state.users.user
});

export default connect(mapStateToProps, {
  getMatches,
  setLoading
})(Matches);
