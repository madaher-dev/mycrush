import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { checkFB } from '../../actions/userActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const FaceBook = ({ checkFB }) => {
  const responseFacebook = response => {
    checkFB(response);
  };
  return (
    <FacebookLogin
      buttonStyle={{ padding: '6px' }}
      appId="380772783291898"
      autoLoad={false}
      fields="name,email,picture"
      scope="public_profile,user_link"
      callback={responseFacebook}
    />
  );
};
FaceBook.propTypes = {
  user: PropTypes.object,
  checkFB: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user
});

export default connect(mapStateToProps, {
  checkFB
})(FaceBook);
