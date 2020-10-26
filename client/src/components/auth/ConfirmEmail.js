import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams, Redirect } from 'react-router-dom';
import { confirmEmail } from '../../actions/userActions';

const ConfirmEmail = ({ confirmEmail, isAuthenticated, error }) => {
  // Pull Token from URL
  let { email_token } = useParams();

  // Check Token on load
  useEffect(() => {
    confirmEmail(email_token);
    // eslint-disable-next-line
  }, []);

  // Form page if token is correct

  if (isAuthenticated) {
    return <Redirect to="/welcome" />;
  }
  if (error) return <Redirect to="/login" />;
  else {
    return <Fragment></Fragment>;
  }
};

ConfirmEmail.propTypes = {
  confirmEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.string
};

const mapStateToProps = state => ({
  user: state.users.user,
  isAuthenticated: state.users.isAuthenticated,
  error: state.users.error
});

export default connect(mapStateToProps, {
  confirmEmail
})(ConfirmEmail);
