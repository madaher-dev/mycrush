import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import MainMenu from './MainMenu';
import { checkUser, logout } from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RedeemIcon from '@material-ui/icons/Redeem';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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
    marginRight: theme.spacing(1)
  },
  title: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
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

const Navbar = ({ checkUser, isAuthenticated, user, logout, points }) => {
  const classes = useStyles();

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const onLogout = () => {
    logout();
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show points" color="inherit">
          <Badge badgeContent={points} color="secondary">
            <RedeemIcon />
          </Badge>
        </IconButton>
        <p>Points</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show notifications" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem onClick={onLogout} to="/login" component={Link}>
        <IconButton color="inherit">
          <ExitToAppIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <LoyaltyIcon className={classes.logo} />
          <Typography className={classes.title} variant="h6" noWrap>
            My Crush
          </Typography>
          <div className={classes.grow} />
          <div className={classes.mainMenu}>
            <MainMenu />
          </div>

          {isAuthenticated ? (
            <Fragment>
              <div className={classes.sectionDesktop}>
                <IconButton aria-label="show points web" color="inherit">
                  <Badge badgeContent={points} color="secondary">
                    <RedeemIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={0} color="secondary">
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
                  {user.pic ? (
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <IconButton
                  onClick={onLogout}
                  to="/"
                  component={Link}
                  color="inherit"
                >
                  <ExitToAppIcon />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </div>{' '}
            </Fragment>
          ) : (
            <Fragment />
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  checkUser: PropTypes.func.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  user: state.users.user,
  points: state.users.points
});

export default connect(mapStateToProps, {
  checkUser,
  logout
})(Navbar);
