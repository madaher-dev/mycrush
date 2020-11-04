import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getMatches, setLoading } from '../../actions/matchActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import MatchAvatar from './MatchAvatar';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },

  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  button: {
    flex: 3,
    display: 'flex'
  },
  button2: {
    alignSelf: 'flex-end'
  }
});

const MatchesBox = ({
  getMatches,
  setLoading,
  loading,
  matches,
  matchesLoaded,
  user
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!matchesLoaded) {
      setLoading();
      getMatches();
    }

    // eslint-disable-next-line
  }, []);

  var size = 5;

  return (
    <Fragment>
      {loading ? (
        <CircularProgress />
      ) : matches && matches.length > 0 ? (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Matches
            </Typography>
            <List>
              {matches.slice(0, size).map(match => (
                <ListItem
                  // onClick={() => handleListItemClick(email)}
                  key={match._id}
                >
                  <ListItemAvatar>
                    <MatchAvatar match={match} userId={user._id} />
                  </ListItemAvatar>
                  {match.sourceId._id === user._id && match.targetId.name ? (
                    <ListItemText
                      primary={match.targetId.name}
                      secondary={Moment(match.createdAt).format('LLL')}
                    />
                  ) : (
                    <ListItemText
                      primary={match.sourceId.name}
                      secondary={Moment(match.createdAt).format('LLL')}
                    />
                  )}

                  {/* <ListItemSecondaryAction>
                    {Moment(match.createdAt).format('LLL')}
                  </ListItemSecondaryAction> */}
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions className={classes.button}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              className={classes.button2}
              component={Link}
              to={'/matches'}
            >
              See All
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
};
MatchesBox.propTypes = {
  matches: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getMatches: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired,
  matchesLoaded: PropTypes.bool.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  matches: state.matches.matches,
  loading: state.matches.loading,
  matchesLoaded: state.matches.matchesLoaded,
  user: state.users.user
});

export default connect(mapStateToProps, {
  getMatches,
  setLoading
})(MatchesBox);
