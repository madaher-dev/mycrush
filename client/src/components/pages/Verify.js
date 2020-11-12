import React, { useEffect, useRef } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
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
  connectPhone,
  validatePhone,
  clearErrors,
  disconnectEmail,
  disconnectPhone,
  connectFB,
  disconnectFB,
  connectInstagram,
  setLoading,
  disconnectInsta,
  clearPhoneStatus
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
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import InstagramIcon from '@material-ui/icons/Instagram';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import InstagramLogin from 'react-instagram-login';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import 'react-phone-number-input/style.css';
// import PhoneInput from 'react-phone-number-input';
//import { withRouter } from 'react-router-dom';

//import ReactPhoneInput from 'react-phone-input-mui';

import MuiPhoneNumber from 'material-ui-phone-number';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(theme => ({
  main: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 100,
    zIndex: 200
  },
  anchor: {
    position: 'fixed',
    top: 'auto',
    bottom: 32
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
  instavatar: {
    backgroundColor: '#C13584'
  },

  fbButton: {
    backgroundColor: '#4267B2',
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'start'
  },
  mailButton: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'start'
  },
  phoneButton: {
    width: '100%',
    backgroundColor: '#25D366',
    '&:hover': {
      backgroundColor: '#128C7E'
    }
  },

  instaIcon: {
    padding: 5
  },
  field: {
    margin: '10px 0'
  },
  countryList: {
    ...theme.typography.body1
  },
  instaButton: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    //display: 'flex',
    //alignItems: 'end',
    //justifyContent: 'center',
    backgroundColor: '#E1306C',
    width: '100%',
    color: 'white',
    borderRadius: 5,
    border: 'none',
    marginTop: 0,
    outline: 0,
    boxShadow: 'lightgray',
    cursor: 'pointer',
    transition: 'ease',
    '&:hover': {
      backgroundColor: '#C13584'
    },

    '&:disabled': {
      cursor: 'default',
      opacity: 1
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

const Verify = ({
  user,
  connectEmail,
  clearErrors,
  setAlert,
  error,
  disconnectEmail,
  disconnectPhone,
  connectFB,
  disconnectFB,
  location,
  connectInstagram,
  setLoading,
  loading,
  disconnectInsta,
  connectPhone,
  validatePhone,
  phoneConnected,
  phoneValidated,
  clearPhoneStatus,
  history
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (error) {
      setAlert(error, 'error');
      clearErrors();
    }
  }, [error, setAlert, clearErrors]);

  // Connect Email Dialog
  const [openConnectEmail, setOpen] = React.useState(false);

  const [email, setEmail] = React.useState('');

  const handleCloseConnectEmail = () => {
    setOpen(false);
  };

  const onChange = e => {
    setEmail(e.target.value);
  };

  // const onChangePhone = e => {
  //   setePhone(e.target.value);
  // };
  const handleDisconnectEmail = id => {
    disconnectEmail(id);
  };

  const handleSubmitConnectEmail = () => {
    setOpen(false);
    connectEmail(email);
  };

  const handleClickOpenConnectEmail = () => {
    handleMenuClose();
    setOpen(true);
  };

  //Phone Connect

  const [phone, setPhone] = React.useState('');
  const [openConnectPhone, setOpenPhone] = React.useState(false);
  const [openValidatePhone, setValidatePhone] = React.useState(false);
  const [token, setTokenValue] = React.useState('');

  useEffect(() => {
    if (phoneConnected) setValidatePhone(true);
  }, [phoneConnected]);

  useEffect(() => {
    if (phoneValidated) {
      setAlert('Phone Successfully Validated', 'success');
      clearPhoneStatus();
    }
  }, [phoneValidated, setAlert, clearPhoneStatus]);

  const handleClickOpenConnectPhone = () => {
    handleMenuClose();
    setOpenPhone(true);
  };

  const handleCloseConnectPhone = () => {
    setOpenPhone(false);
    setValidatePhone(false);
    clearPhoneStatus();
  };

  const handleSubmitConnectPhone = async () => {
    setOpenPhone(false);
    await connectPhone(phone);
    setValidatePhone(true);
  };

  const setToken = e => {
    setTokenValue(e.target.value);
  };

  const handleValidatePhone = async () => {
    await validatePhone(token);
    setValidatePhone(false);
  };

  const handleCloseValidatePhone = async () => {
    setValidatePhone(false);
    clearPhoneStatus();
  };

  const handleDisconnectPhone = phoneID => {
    disconnectPhone(phoneID);
  };

  // FB connect - disconnect
  const handleDisconnectFB = id => {
    disconnectFB(id);
  };

  const responseFacebook = async response => {
    handleMenuClose();
    connectFB(response, user._id);
  };

  //Instagram - Connect
  const responseInstagram = async response => {
    //   if (!instaAdded) {
    handleMenuClose();
    setLoading();
    await connectInstagram(response);
    history.push('/verify');
    // }
  };

  const handleDisconnectInsta = () => {
    setLoading();
    disconnectInsta();
  };

  // Networks Menu

  const [menu, setMenuOpen] = React.useState(false);
  const handleMenuClose = () => {
    setMenuOpen(false);
  };
  //Location of div bottom center
  const divRef = useRef();
  const [anchorEl, setAnchorEl] = React.useState(null);

  //get open from footer
  if (location.addOpen) {
    setMenuOpen(true);
    setAnchorEl(divRef.current);
    location.addOpen = false;
  }

  const renderNetworksMenu = (
    <Menu
      anchorEl={anchorEl}
      // getContentAnchorEl={null}
      // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={'networks-menu'}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={menu}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          paddingBottom: 50
        }
      }}
      style={{ zIndex: 1000 }}
    >
      <MenuItem>
        <Button
          variant="contained"
          color="primary"
          className={classes.mailButton}
          // disabled={isSubmitting}
          onClick={handleClickOpenConnectEmail}
          startIcon={<EmailIcon />}
        >
          Connect new Email
        </Button>
      </MenuItem>
      <MenuItem>
        <Button
          variant="contained"
          className={classes.phoneButton}
          onClick={handleClickOpenConnectPhone}
          startIcon={<PhoneIcon />}
        >
          Connect Phone Number
        </Button>
      </MenuItem>

      {!user.facebook && (
        <MenuItem>
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            fields="name,email,picture, link"
            scope="public_profile, user_link"
            redirectUri="https://mycrushapp.herokuapp.com/verify"
            isMobile={false}
            callback={responseFacebook}
            render={renderProps => (
              <Button
                variant="contained"
                color="primary"
                // disabled={isSubmitting}
                onClick={renderProps.onClick}
                className={classes.fbButton}
                startIcon={<FacebookIcon />}
              >
                Login with Facebook
              </Button>
            )}
          />
        </MenuItem>
      )}

      {!user.instagram && (
        <MenuItem>
          <InstagramLogin
            clientId={process.env.REACT_APP_INSTA_CLIENT_ID}
            onSuccess={responseInstagram}
            scope="user_profile"
            onFailure={responseInstagram}
            cssClass={classes.instaButton}
            // buttonText="Connect Instagram"
          >
            <InstagramIcon className={classes.instaIcon} />
            <span className={classes.instaText}> Connect Instagram</span>
          </InstagramLogin>
        </MenuItem>
      )}
    </Menu>
  );

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
          <Dialog
            open={openConnectEmail}
            onClose={handleCloseConnectEmail}
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
              <Button onClick={handleCloseConnectEmail} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitConnectEmail} color="primary">
                Connect
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openConnectPhone}
            onClose={handleCloseConnectPhone}
            aria-labelledby="phone-dialog-title"
          >
            <DialogTitle id="phone-dialog-title">
              Connect a Phone Number
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                You can connect a phone number to be matched with! You will need
                to verify the phone after adding it. This will cost you one
                point!
              </DialogContentText>

              <MuiPhoneNumber
                defaultCountry={'us'}
                onChange={setPhone}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConnectPhone} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitConnectPhone} color="primary">
                Connect
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openValidatePhone && phoneConnected}
            onClose={handleCloseValidatePhone}
            aria-labelledby="validate-phone"
          >
            <DialogTitle id="phone-dialog-title">
              Validate Phone Number
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter the code you received by SMS to validate your phone
                number. If you did not reveive the code you can try to validate
                again!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="token"
                label="Validation Code"
                type="number"
                onChange={setToken}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseValidatePhone} color="primary">
                Cancel
              </Button>
              <Button onClick={handleValidatePhone} color="primary">
                Validate
              </Button>
            </DialogActions>
          </Dialog>
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
                      onClick={() => handleDisconnectFB(user.facebookID)}
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
      {renderNetworksMenu}
      <div className={classes.anchor} ref={divRef} />
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
  disconnectFB: PropTypes.func.isRequired,
  connectInstagram: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired,
  disconnectInsta: PropTypes.func.isRequired,
  connectPhone: PropTypes.func.isRequired,
  disconnectPhone: PropTypes.func.isRequired,
  validatePhone: PropTypes.func.isRequired,
  phoneConnected: PropTypes.bool,
  phoneValidated: PropTypes.bool,
  clearPhoneStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user,
  error: state.users.error,
  loading: state.users.loading,
  phoneConnected: state.users.phoneConnected,
  phoneValidated: state.users.phoneValidated
});

export default connect(mapStateToProps, {
  connectEmail,
  connectPhone,
  validatePhone,
  clearErrors,
  setAlert,
  disconnectEmail,
  disconnectPhone,
  connectFB,
  disconnectFB,
  connectInstagram,
  setLoading,
  disconnectInsta,
  clearPhoneStatus
})(Verify);
