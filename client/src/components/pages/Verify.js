import React, { useEffect, useRef } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  clearErrors,
  disconnectEmail,
  disconnectPhone,
  disconnectFB,
  connectInstagram,
  setLoading,
  disconnectInsta,
  checkUser,
  disconnectTwitter
} from '../../actions/userActions';
import { setMenuOpen, OpenConnectEmail } from '../../actions/navigationActions';
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

import FacebookIcon from '@material-ui/icons/Facebook';
import EmailIcon from '@material-ui/icons/Email';

import InstagramIcon from '@material-ui/icons/Instagram';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-number-input';
//import { withRouter } from 'react-router-dom';

//import ReactPhoneInput from 'react-phone-input-mui';

import PhoneIcon from '@material-ui/icons/Phone';

import TwitterIcon from '@material-ui/icons/Twitter';
import NetworksMenu from '../layout/NetworksMenu';
import ConnectEmail from '../dialogs/ConnectEmail';
import ConnectPhone from '../dialogs/ConnectPhone';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 100,
    zIndex: 200
  },

  buttons: {
    flexGrow: 1
  },
  avatar: {
    backgroundColor: '#e91e63'
  },
  avatarPhone: {
    backgroundColor: '#25D366'
  },
  fbavatar: {
    backgroundColor: '#4267B2'
  },
  twavatar: {
    backgroundColor: '#1DA1F2'
  },
  instavatar: {
    backgroundColor: '#C13584'
  },
  field: {
    margin: '10px 0'
  },
  countryList: {
    ...theme.typography.body1
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  anchor: {
    position: 'fixed',
    top: 'auto',
    bottom: 32,
    backgroundColor: '#C13584'
  }
}));

const Verify = ({
  user,
  setMenuOpen,
  clearErrors,
  setAlert,
  error,
  disconnectEmail,
  disconnectPhone,
  disconnectFB,
  location,
  connectInstagram,
  setLoading,
  loading,
  disconnectInsta,
  disconnectTwitter,
  history,
  open
}) => {
  const classes = useStyles();

  // CTA Handler

  //Location of div bottom center
  const divRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    setAnchorEl(divRef.current);
  }, [setAnchorEl]);

  useEffect(() => {
    if (location.addOpen && !open) {
      setMenuOpen(true);
      location.addOpen = false;
    }
  }, [setMenuOpen, location.addOpen, open]);

  // Error Handler

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  const handleDisconnectEmail = id => {
    disconnectEmail(id);
  };

  const handleDisconnectPhone = phoneID => {
    disconnectPhone(phoneID);
  };

  // FB connect - disconnect
  const handleDisconnectFB = () => {
    disconnectFB();
  };

  const handleDisconnectTwitter = () => {
    setLoading();
    disconnectTwitter();
  };

  const handleDisconnectInsta = () => {
    setLoading();
    disconnectInsta();
  };

  return (
    <Grid
      container
      spacing={0}
      direction="row"
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
          <Typography>
            Below are the networks that you have currently verified. Connect
            more networks to increase your chances of a match!
          </Typography>
          <ConnectEmail />
          <ConnectPhone />
        </Grid>
        <Grid item xs={12}>
          <List>
            <ListItem
            //button
            // onClick={() => handleListItemClick(email)}
            >
              <ListItemAvatar color="primary">
                <Avatar>
                  <AccountCircleIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
            {user.facebook && (
              <ListItem button component="a" href={user.facebook} target="_new">
                <ListItemAvatar>
                  <Avatar className={classes.fbavatar}>
                    <FacebookIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={'Your Facebook Profile Page'} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDisconnectFB()}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            )}
            {user.twitter && (
              <ListItem
                button
                component="a"
                href={`https://www.twitter.com/${user.twitter}`}
                target="_new"
              >
                <ListItemAvatar>
                  <Avatar className={classes.twavatar}>
                    <TwitterIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.twitter} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDisconnectTwitter()}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            )}
            {user.instagram && (
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.instavatar}>
                    <InstagramIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.instagram} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDisconnectInsta()}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            )}
            <ListItem
            //button
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
                //button
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
                      onClick={() => handleDisconnectEmail(email._id)}
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
            {user.phones.map(phone => (
              <ListItem
                //button
                // onClick={() => handleListItemClick(email)}
                key={phone._id}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatarPhone}>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={phone.number} />
                <ListItemSecondaryAction>
                  <Tooltip title="Disconnect" aria-label="disc">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDisconnectPhone(phone._id)}
                    >
                      <CancelIcon color="secondary" />
                    </IconButton>
                  </Tooltip>

                  {phone.confirmed ? (
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
                    <Tooltip title="Not Verified" aria-label="notconfirmed">
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
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.anchor} ref={divRef} />

      {user && (
        <NetworksMenu
          //user={user}
          //footer={location.addOpen}
          // handleClickOpenConnectEmail={() => handleClickOpenConnectEmail()}
          //handleClickOpenConnectPhone={() => handleClickOpenConnectPhone()}
          // responseFacebook={() => responseFacebook()}
          // responseInstagram={() => responseInstagram()}
          history={history}
          anchor={anchorEl}
        />
      )}
    </Grid>
  );
};

Verify.propTypes = {
  user: PropTypes.object,
  error: PropTypes.string,
  clearErrors: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  disconnectEmail: PropTypes.func.isRequired,
  disconnectFB: PropTypes.func.isRequired,
  connectInstagram: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired,
  disconnectInsta: PropTypes.func.isRequired,
  disconnectPhone: PropTypes.func.isRequired,
  checkUser: PropTypes.func.isRequired,
  disconnectTwitter: PropTypes.func.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  OpenConnectEmail: PropTypes.func.isRequired,
  open: PropTypes.bool,
  openEmail: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.users.user,
  error: state.users.error,
  loading: state.users.loading,
  open: state.navigation.openMenu
});

export default connect(mapStateToProps, {
  clearErrors,
  setAlert,
  disconnectEmail,
  disconnectPhone,
  disconnectFB,
  connectInstagram,
  setLoading,
  disconnectInsta,
  checkUser,
  disconnectTwitter,
  setMenuOpen,
  OpenConnectEmail
})(Verify);
