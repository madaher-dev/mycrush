import { Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { setEvent } from '../../actions/userActions';

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0
  },
  grow: {
    flexGrow: 1
  },
  privacy: {
    textDecoration: 'none',
    color: 'white'
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto'
  },
  netfabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
    color: 'white',
    backgroundColor: '#4267B2',
    '&:hover': {
      backgroundColor: '#5b1ce8'
    }
  }
}));

const Footer = ({ page, setEvent }) => {
  const classes = useStyles();
  const theme = useTheme();
  const addCrush = {
    pathname: '/crushes',
    addOpen: true
  };

  const networksLoc = event => {
    setEvent(event.target);
  };

  const addNetwork = {
    pathname: '/verify',
    addOpen: true
  };
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };
  let page2;
  if (page === 'Dashboard' || page === 'Crushes') page2 = 0;
  else if (page === 'Networks') page2 = 1;
  const fabs = [
    {
      id: 0,
      className: classes.fabButton,
      dir: addCrush,
      color: 'secondary',
      tip: 'Add Crush'
    },
    {
      id: 1,
      className: classes.netfabButton,
      dir: addNetwork,
      tip: 'Add Network'
    }
  ];

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <Typography>
          MyCrush Copyright &copy;{Moment(Date.now()).format('YYYY')} v0.1.0
        </Typography>
        {fabs.map((fab, index) => (
          <Zoom
            key={fab.id}
            in={page2 === index}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${
                page2 === index ? transitionDuration.exit : 0
              }ms`
            }}
            unmountOnExit
          >
            <Tooltip title={fab.tip} aria-label="add">
              <Fab
                aria-label={fab.label}
                className={fab.className}
                component={Link}
                onClick={networksLoc}
                to={fab.dir}
                color={fab.color}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Zoom>
        ))}
        <div className={classes.grow} />
        <Typography
          component={Link}
          to={'/privacy'}
          className={classes.privacy}
        >
          Privacy Policy
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

Footer.propTypes = {
  page: PropTypes.string,
  setEvent: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  page: state.users.page
});

export default connect(mapStateToProps, { setEvent })(Footer);
