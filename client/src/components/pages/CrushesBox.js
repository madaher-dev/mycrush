import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCrushes, setLoading } from '../../actions/crushActions';
import CrushAvatar from './CrushAvatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import Moment from 'moment';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
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

const CrushesBox = ({
  getCrushes,
  setLoading,
  loading,
  crushes,
  crushesLoaded
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (!crushesLoaded) {
      setLoading();
      getCrushes();
    }

    // eslint-disable-next-line
  }, []);

  var size = 5;

  return (
    <Fragment>
      {loading ? (
        <CircularProgress />
      ) : crushes && crushes.length > 0 ? (
        <Card className={classes.root}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Crushes
            </Typography>
            <List>
              {crushes.slice(0, size).map(crush => (
                <ListItem
                  // onClick={() => handleListItemClick(email)}
                  key={crush._id}
                >
                  <ListItemAvatar>
                    <CrushAvatar name={crush.name} />
                  </ListItemAvatar>
                  <ListItemText primary={crush.name} />
                  <ListItemSecondaryAction>
                    {Moment(crush.createdAt).format('LLL')}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
          <CardActions className={classes.button}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              component={Link}
              to={'/crushes'}
              className={classes.button2}
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
CrushesBox.propTypes = {
  crushes: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  getCrushes: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired,
  crushesLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  crushes: state.crushes.crushes,
  loading: state.crushes.loading,
  crushesLoaded: state.crushes.crushesLoaded
});

export default connect(mapStateToProps, {
  getCrushes,
  setLoading
})(CrushesBox);
