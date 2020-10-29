import React, { useEffect, Fragment } from 'react';
import { Button, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  connectEmail,
  clearErrors,
  disconnectEmail,
  connectFB,
  disconnectFB
} from '../../actions/userActions';
import { setAlert } from '../../actions/alertActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import FacebookIcon from '@material-ui/icons/Facebook';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  },
  buttons: {
    flexGrow: 1
  },
  avatar: {
    backgroundColor: '#e91e63'
  },

  fbButton: {
    margin: 3,
    backgroundColor: '#4267B2'
  }
}));

const Verify = ({
  user,
  connectEmail,
  clearErrors,
  setAlert,
  error,
  disconnectEmail,
  connectFB,
  disconnectFB
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onChange = e => {
    setEmail(e.target.value);
  };

  const handleDelete = id => {
    disconnectEmail(id);
  };

  const handleDisconnectFB = id => {
    disconnectFB(id);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    connectEmail(email);
  };
  const responseFacebook = response => {
    connectFB(response, user._id);
  };
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid
        item
        container
        xs={12}
        sm={10}
        className={classes.main}
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            // disabled={isSubmitting}
            onClick={handleClickOpen}
          >
            Connect new Email
          </Button>
          {user.facebook ? (
            <Fragment />
          ) : (
            <FacebookLogin
              appId="380772783291898"
              fields="name,email,picture"
              //   scope="public_profile,user_link"
              //autoLoad
              callback={responseFacebook}
              render={renderProps => (
                <Button
                  variant="contained"
                  color="primary"
                  // disabled={isSubmitting}
                  onClick={renderProps.onClick}
                  className={classes.fbButton}
                >
                  Connect Facebook
                </Button>
              )}
            />
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Connect new Email</DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can connect more emails to be matched with any of them! You
                will need to verify the email after adding it.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                onChange={onChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Connect
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Grid item xs={12}>
          <List>
            {user.facebook ? (
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <FacebookIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.facebook} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDisconnectFB(user.facebook)}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ) : (
              <Fragment />
            )}
            <ListItem
              button
              // onClick={() => handleListItemClick(email)}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <EmailIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.email} />
              <ListItemSecondaryAction>
                <Tooltip title="Confirmed" aria-label="confirmed">
                  <IconButton
                    edge="end"
                    aria-label="status"
                    disableRipple
                    // onClick={() => handleDelete(email._id)}
                  >
                    <VerifiedUserIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            {user.otherEmails.map(email => (
              <ListItem
                button
                // onClick={() => handleListItemClick(email)}
                key={email._id}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email.email} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(email._id)}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>

                  {email.confirmed ? (
                    <Tooltip title="Confirmed" aria-label="confirmed">
                      <IconButton
                        edge="end"
                        aria-label="status"
                        disableRipple
                        // onClick={() => handleDelete(email._id)}
                      >
                        <VerifiedUserIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Not Confirmed" aria-label="notconfirmed">
                      <IconButton
                        edge="end"
                        aria-label="status"
                        disableRipple
                        // onClick={() => handleDelete(email._id)}
                      >
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
};

Verify.propTypes = {
  user: PropTypes.object,
  connectEmail: PropTypes.func.isRequired,
  error: PropTypes.string,
  clearErrors: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  disconnectEmail: PropTypes.func.isRequired,
  connectFB: PropTypes.func.isRequired,
  disconnectFB: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user,
  error: state.users.error
});

export default connect(mapStateToProps, {
  connectEmail,
  clearErrors,
  setAlert,
  disconnectEmail,
  connectFB,
  disconnectFB
})(Verify);
