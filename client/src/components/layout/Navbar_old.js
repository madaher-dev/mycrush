import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { Grid, IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { Link } from 'react-router-dom';
import HoverMenu from './HoverMenu';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import { checkUser, logout } from '../../actions/userActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'white'
  },
  main: {
    backgroundColor: 'red'
  },
  title2: {
    backgroundColor: 'blue'
  },
  menu2: {
    backgroundColor: 'yellow'
  },
  // title: {
  //   display: 'block',
  //   [theme.breakpoints.up('sm')]: {
  //     display: 'block'
  //   }
  // },
  // menu: {
  //   display: 'none',
  //   [theme.breakpoints.up('sm')]: {
  //     display: 'block'
  //   }
  // },

  // sectionDesktop: {
  //   display: 'none',
  //   [theme.breakpoints.up('md')]: {
  //     display: 'flex'
  //   }
  // },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },

  drop: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

const Navbar = ({ checkUser, loading, isAuthenticated, user, logout }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  // const large = require('../../images/logo_header.png');
  // useEffect(() => {
  //   checkUser();

  //   // eslint-disable-next-line
  // }, [isAuthenticated]);

  const onLogout = () => {
    logout();
  };
  const guestLinks = (
    <Grid item container xs={false} sm={6} className={classes.menu}>
      <Button to="/" component={Link} color="inherit">
        Home
      </Button>
      <Button to="/about" component={Link} color="inherit">
        About
      </Button>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        Contribute
      </Button>
      <ClickAwayListener onClickAway={handleClose}>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          onMouseLeave={handleClose}
          className={classes.drop}
          color="inherit"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={handleClose}
                      to="/donate/Direct"
                      component={Link}
                    >
                      To Samidoun
                    </MenuItem>
                    <MenuItem onClick={handleClose}>To Benificiary</MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      to="/musicians"
                      component={Link}
                    >
                      To Musicians
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </ClickAwayListener>
    </Grid>
  );

  const authLinks = (
    <Grid item container xs={6} sm={8} className={classes.menu2}>
      <Grid item xs={false} sm={4}>
        <Button to="/" component={Link} color="inherit">
          Home
        </Button>
        <Button to="/about" component={Link} color="inherit">
          Verify
        </Button>

        <Button color="inherit">Volunteer</Button>
        <Button to="/contact" component={Link} color="inherit">
          Contact
        </Button>
      </Grid>
      <Grid item xs={6} sm={4}>
        <Typography>You have 6 points</Typography>
      </Grid>
      <Grid item xs={6} sm={4} className={classes.menu}>
        <Typography
          color="inherit"
          noWrap
          className={classes.links}
          to="/admin/planners"
          component={Link}
        >
          Hello {user && user.name}
        </Typography>
        <IconButton
          onClick={onLogout}
          to="/login"
          component={Link}
          color="inherit"
        >
          <ExitToAppIcon />
        </IconButton>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Grid>
    </Grid>
  );
  return (
    <AppBar position="static">
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        className={classes.main}
      >
        <Toolbar>
          <Grid item xs={2} sm={false} className={classes.sectionMobile}>
            <HoverMenu />
          </Grid>

          <Grid item container xs={6} sm={4} className={classes.title2}>
            <Typography className={classes.title} variant="h6" noWrap>
              <LoyaltyIcon /> My Crush
            </Typography>
          </Grid>
          {isAuthenticated ? authLinks : guestLinks}
        </Toolbar>
      </Grid>
    </AppBar>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  checkUser: PropTypes.func.isRequired,
  user: PropTypes.array,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  loading: state.users.loading,
  user: state.users.user
});
export default connect(mapStateToProps, {
  checkUser,
  logout
})(Navbar);
