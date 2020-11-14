import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setMenuOpen,
  OpenConnectEmail,
  OpenConnectPhone
} from '../../actions/navigationActions';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import InstagramLogin from 'react-instagram-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import TwitterLogin from 'react-twitter-auth';
import PhoneIcon from '@material-ui/icons/Phone';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import { setAlert } from '../../actions/alertActions';
import {
  checkUser,
  clearErrors,
  connectFB,
  connectInstagram,
  setLoading
} from '../../actions/userActions';

const useStyles = makeStyles(theme => ({
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
  fbButton: {
    backgroundColor: '#4267B2',
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'start'
  },
  instaButton: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  twButton: {
    width: '100%',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    border: 'none',
    //marginTop: 10,
    backgroundColor: '#1DA1F2',
    transition: 'ease',
    '&:hover': {
      backgroundColor: '#AAB8C2'
    },

    '&:disabled': {
      cursor: 'default',
      opacity: 1
    },
    color: 'white',
    borderRadius: 5,
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: 'lightgray'
  },
  twIcon: {
    padding: 5
  },
  instaIcon: {
    padding: 5
  }
}));

const NetworksMenu = ({
  OpenConnectEmail,
  OpenConnectPhone,
  user,
  setMenuOpen,
  open,
  checkUser,
  anchor,
  clearErrors,
  setAlert,
  connectFB,
  connectInstagram,
  history,
  setLoading
}) => {
  const classes = useStyles();

  // Networks Menu

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleOpenConnectEmail = () => {
    OpenConnectEmail(true);
    setMenuOpen(false);
  };

  const handleOpenConnectPhone = () => {
    setMenuOpen(false);
    OpenConnectPhone(true);
  };

  const twitterOnFailed = response => {
    setMenuOpen(false);

    const errorString =
      '{' +
      response
        .toString()
        .replace(/Error/g, '"error"')
        .replace(/: /g, ': "') +
      '"}';

    setAlert(JSON.parse(errorString).error, 'error');
    clearErrors();
  };

  const twitterOnSuccess = response => {
    setMenuOpen(false);

    if (response.ok) checkUser();
    else if (response.status === 400) {
      setAlert(
        'This twitter account is already connected to another user!',
        'error'
      );
      clearErrors();
    }
  };

  const responseFacebook = async response => {
    setMenuOpen(false);
    connectFB(response);
  };

  //Instagram - Connect
  const responseInstagram = async response => {
    //   if (!instaAdded) {
    setMenuOpen(false);
    setLoading();
    await connectInstagram(response);
    history.push('/verify');
    // }
  };

  return (
    <Menu
      anchorEl={anchor}
      // getContentAnchorEl={null}
      // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      id={'networks-menu'}
      keepMounted
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
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
          onClick={handleOpenConnectEmail}
          startIcon={<EmailIcon />}
        >
          Connect new Email
        </Button>
      </MenuItem>
      <MenuItem>
        <Button
          variant="contained"
          className={classes.phoneButton}
          onClick={handleOpenConnectPhone}
          startIcon={<PhoneIcon />}
        >
          Connect Phone Number
        </Button>
      </MenuItem>

      {user && !user.facebook && (
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
                Connect Facebook
              </Button>
            )}
          />
        </MenuItem>
      )}

      {user && !user.instagram && (
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
            <span> Connect Instagram</span>
          </InstagramLogin>
        </MenuItem>
      )}

      {user && !user.twitter && (
        <MenuItem>
          <TwitterLogin
            loginUrl="https://mycrushapp.herokuapp.com/api/v1/networks/twitter/connect"
            onFailure={twitterOnFailed}
            onSuccess={twitterOnSuccess}
            requestTokenUrl="https://mycrushapp.herokuapp.com/api/v1/networks/twitter/reverse"
            className={classes.twButton}
            showIcon={false}
          >
            <TwitterIcon className={classes.twIcon} />
            <span> Connect Twitter</span>
          </TwitterLogin>
        </MenuItem>
      )}
    </Menu>
  );
};

NetworksMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  OpenConnectEmail: PropTypes.func.isRequired,
  OpenConnectPhone: PropTypes.func.isRequired,
  user: PropTypes.object,
  checkUser: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  connectFB: PropTypes.func.isRequired,
  connectInstagram: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  open: state.navigation.openMenu,
  user: state.users.user
});

export default connect(mapStateToProps, {
  setMenuOpen,
  OpenConnectEmail,
  OpenConnectPhone,
  checkUser,
  setAlert,
  clearErrors,
  connectInstagram,
  connectFB,
  setLoading
})(NetworksMenu);
