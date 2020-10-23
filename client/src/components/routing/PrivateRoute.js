import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { checkUser } from '../../actions/userActions';

const PrivateRoute = ({
  isAuthenticated,
  loading,
  checkUser,
  component: Component,
  ...rest
}) => {
  if (!isAuthenticated) {
    checkUser();
  }
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated && !loading ? (
          <Component {...props} />
        ) : loading ? (
          <LinearProgress />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool,
  checkUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  loading: state.users.loading
});

export default connect(mapStateToProps, { checkUser })(PrivateRoute);
