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
  disconnectEmail
} from '../../actions/userActions';
import { setAlert } from '../../actions/alertActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20
  },
  buttons: {
    flexGrow: 1
  },
  avatar: {
    backgroundColor: 'red',
    color: 'blue'
  }
}));

const Verify = ({
  user,
  connectEmail,
  clearErrors,
  setAlert,
  error,
  disconnectEmail
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
              <ListItem
                button
                // onClick={() => handleListItemClick(email)}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.facebook} />
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
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.email} />
            </ListItem>
            {user.otherEmails.map(email => (
              <ListItem
                button
                // onClick={() => handleListItemClick(email)}
                key={email._id}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email.email} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(email._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="status"
                    // onClick={() => handleDelete(email._id)}
                  >
                    {email.confirmed ? <VerifiedUserIcon /> : <BlockIcon />}
                  </IconButton>
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
  disconnectEmail: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user,
  error: state.users.error
});

export default connect(mapStateToProps, {
  connectEmail,
  clearErrors,
  setAlert,
  disconnectEmail
})(Verify);
