import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const MainMenu = ({ isAuthenticated }) => {
  const guestLinks = (
    <Grid container>
      <Button to="/" component={Link} color="inherit">
        Home
      </Button>
      <Button to="/tutorial" component={Link} color="inherit">
        How it works
      </Button>
      <Button to="/about" component={Link} color="inherit">
        About
      </Button>
    </Grid>
  );

  const authLinks = (
    <Grid container>
      <Button to="/welcome" component={Link} color="inherit">
        Dashboard
      </Button>
      <Button to="/crushes" component={Link} color="inherit">
        Crushes
      </Button>
      <Button to="/verify" component={Link} color="inherit">
        Verify
      </Button>
      <Button to="/matches" component={Link} color="inherit">
        Matches
      </Button>
    </Grid>
  );
  return <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>;
};

MainMenu.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated
});
export default connect(mapStateToProps, {})(MainMenu);
