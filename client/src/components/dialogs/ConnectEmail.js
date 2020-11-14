import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { OpenConnectEmail } from '../../actions/navigationActions';
import { connectEmail } from '../../actions/userActions';

const ConnectEmail = ({ OpenConnectEmail, openEmail, connectEmail }) => {
  const [email, setEmail] = React.useState('');

  const onChange = e => {
    setEmail(e.target.value);
  };

  const handleCloseConnectEmail = () => {
    OpenConnectEmail(false);
  };

  const handleSubmitConnectEmail = () => {
    OpenConnectEmail(false);
    connectEmail(email);
  };

  return (
    <Dialog
      open={openEmail}
      onClose={handleCloseConnectEmail}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Connect new Email</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can connect more emails to be matched with any of them! You will
          need to verify the email after adding it.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          onChange={onChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConnectEmail} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmitConnectEmail} color="primary">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConnectEmail.propTypes = {
  OpenConnectEmail: PropTypes.func.isRequired,
  connectEmail: PropTypes.func.isRequired,
  openEmail: PropTypes.bool
};

const mapStateToProps = state => ({
  openEmail: state.navigation.openEmail
});

export default connect(mapStateToProps, {
  OpenConnectEmail,
  connectEmail
})(ConnectEmail);
