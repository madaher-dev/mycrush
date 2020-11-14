import React from 'react';
import { Typography } from '@material-ui/core';
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
import { useLocation } from 'react-router-dom';
import { setAddCrush } from '../../actions/crushActions';

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

const Footer = ({ add, setAddCrush }) => {
  const classes = useStyles();
  const theme = useTheme();

  const addCrush = {
    pathname: '/crushes'
  };

  const addNetwork = {
    pathname: '/verify',
    addOpen: true
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  const location = useLocation();

  const noClick = () => {
    return;
  };
  let page2;
  if (
    location.pathname === '/welcome' ||
    (location.pathname === '/crushes' && !add)
  )
    page2 = 0;
  else if (location.pathname === '/verify') page2 = 1;
  const fabs = [
    {
      id: 0,
      className: classes.fabButton,
      dir: addCrush,
      color: 'secondary',
      tip: 'Add Crush',
      click: () => setAddCrush()
    },
    {
      id: 1,
      className: classes.netfabButton,
      dir: addNetwork,
      tip: 'Add Network',
      click: () => noClick()
    }
  ];

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <Typography>
          MyCrush Copyright &copy;{Moment(Date.now()).format('YYYY')} v0.3.0
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
                to={fab.dir}
                color={fab.color}
                onClick={fab.click}
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
  add: PropTypes.bool,
  setAddCrush: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  add: state.crushes.addOpen
});

export default connect(mapStateToProps, { setAddCrush })(Footer);
