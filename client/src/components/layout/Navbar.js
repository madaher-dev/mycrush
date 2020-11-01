import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MainMenu from './MainMenu';
import {
  checkUser,
  logout,
  setMobileMenuOpen
} from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RedeemIcon from '@material-ui/icons/Redeem';
import Avatar from '@material-ui/core/Avatar';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  logo: {
    marginRight: theme.spacing(1),
    textDecoration: 'none',
    color: 'white'
  },
  title: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    textDecoration: 'none',
    color: 'white'
  },
  mainMenu: {
    position: 'relative',
    marginRight: theme.spacing(6),
    marginLeft: 0,
    width: 'auto',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      display: 'block'
    }
  },

  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

const Navbar = ({
  checkUser,
  isAuthenticated,
  user,
  logout,
  points,
  setMobileMenuOpen,
  notifications
}) => {
  const classes = useStyles();

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
  };

  const mobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            // aria-controls={menuId}
            aria-haspopup="true"
            onClick={mobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <IconButton component={Link} to="/">
            <LoyaltyIcon className={classes.logo} />
          </IconButton>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            component={Link}
            to="/"
          >
            MyCrush
          </Typography>
          <div className={classes.grow} />
          <div className={classes.mainMenu}>
            <MainMenu />
          </div>

          {isAuthenticated && user ? (
            <Fragment>
              <div className={classes.sectionDesktop}>
                <IconButton aria-label="show points web" color="inherit">
                  <Badge badgeContent={points} color="secondary">
                    <RedeemIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label="notifications"
                  color="inherit"
                  component={Link}
                  to="/notifications"
                >
                  <Badge badgeContent={notifications} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  // aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user.photo ? (
                    <Avatar alt="user avatar" src={user.photo} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <IconButton onClick={onLogout} color="inherit">
                  <ExitToAppIcon />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="notifications"
                  color="inherit"
                  component={Link}
                  to="/notifications"
                >
                  <Badge badgeContent={notifications} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  // aria-controls={menuId}
                  // aria-haspopup="true"
                  // onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user.photo ? (
                    <Avatar alt="Remy Sharp" src={user.photo} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </div>{' '}
            </Fragment>
          ) : (
            <Fragment />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  checkUser: PropTypes.func.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired,
  setMobileMenuOpen: PropTypes.func.isRequired,
  notifications: PropTypes.number
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  user: state.users.user,
  points: state.users.points,
  notifications: state.users.newNotifications
});

export default connect(mapStateToProps, {
  checkUser,
  logout,
  setMobileMenuOpen
})(Navbar);
