import React, { Fragment, useEffect } from 'react';
import {
  getNotifications,
  clearNotifications
} from '../../actions/userActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import StarsIcon from '@material-ui/icons/Stars';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import { Link } from 'react-router-dom';
import Moment from 'moment';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingBottom: 100,
    paddingLeft: 20
  },
  avatar: {
    backgroundColor: '#e91e63'
  }
}));

const Notifications = ({
  getNotifications,
  notifications,
  clearNotifications
}) => {
  const classes = useStyles();
  useEffect(() => {
    getNotifications();
    clearNotifications();

    //checkUser();
    // eslint-disable-next-line
  }, []);

  const list = (
    <List>
      {notifications.map(notification => (
        <Fragment key={notification._id + 1}>
          {notification.notType === 'new-crush' ? (
            <ListItem
              button
              // onClick={() => handleListItemClick(notification)}
              key={notification._id}
              component={Link}
              to="/crushes"
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <AlarmOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`You have a new crush. Have an idea who it might be? Add a new crush and let's wait for a Match!`}
                secondary={Moment(notification.createdAt).format('LLL')}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  //onClick={() => handleDisconnectEmail(email._id)}
                >
                  <CancelIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ) : notification.notType === 'new-match' ? (
            <ListItem
              button
              // onClick={() => handleListItemClick(notification)}
              key={notification._id}
              component={Link}
              to="/matches"
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <StarsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Congratulations! You have a new Match. Go to the Matches page to see details about your match`}
                secondary={Moment(notification.createdAt).format('LLL')}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  //onClick={() => handleDisconnectEmail(email._id)}
                >
                  <CancelIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ) : (
            <Fragment />
          )}
        </Fragment>
      ))}
    </List>
  );
  return (
    <Grid container spacing={0} direction="row">
      <Grid item container xs={12} sm={10} className={classes.main}>
        <Grid item xs={12}>
          {notifications.length > 0 ? list : <Fragment />}
        </Grid>
      </Grid>
    </Grid>
  );
};

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  totalNotifications: PropTypes.number
};

const mapStateToProps = state => ({
  notifications: state.users.notifications,
  totalNotifications: state.users.user.notifications
});

export default connect(mapStateToProps, {
  getNotifications,
  clearNotifications
})(Notifications);
