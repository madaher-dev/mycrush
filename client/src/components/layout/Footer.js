import { Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
  }
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <Typography>
          MyCrush Copyright &copy;{Moment(Date.now()).format('YYYY')}
        </Typography>
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

export default Footer;
