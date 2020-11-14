import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MuiPhoneNumber from 'material-ui-phone-number';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import { OpenConnectPhone } from '../../actions/navigationActions';
import { setAlert } from '../../actions/alertActions';
import {
  validatePhone,
  connectPhone,
  clearPhoneStatus
} from '../../actions/userActions';

const ConnectPhone = ({
  OpenConnectPhone,
  phoneConnected,
  validatePhone,
  phoneValidated,
  connectPhone,
  clearPhoneStatus,
  openPhone
}) => {
  //Phone Connect

  const [phone, setPhone] = React.useState('');
  //const [openConnectPhone, setOpenPhone] = React.useState(false);
  const [openValidatePhone, setValidatePhone] = React.useState(false);
  const [token, setTokenValue] = React.useState('');

  useEffect(() => {
    if (phoneConnected) setValidatePhone(true);
  }, [phoneConnected]);

  useEffect(() => {
    if (phoneValidated) {
      setAlert('Phone Successfully Validated', 'success');
      clearPhoneStatus();
    }
  }, [phoneValidated, clearPhoneStatus]);

  const handleCloseConnectPhone = () => {
    OpenConnectPhone(false);
    setValidatePhone(false);
    clearPhoneStatus();
  };

  const handleSubmitConnectPhone = async () => {
    OpenConnectPhone(false);
    await connectPhone(phone);
    setValidatePhone(true);
  };

  const setToken = e => {
    setTokenValue(e.target.value);
  };

  const handleValidatePhone = async () => {
    await validatePhone(token);
    setValidatePhone(false);
  };

  const handleCloseValidatePhone = async () => {
    setValidatePhone(false);
    clearPhoneStatus();
  };

  return (
    <Fragment>
      <Dialog
        open={openPhone}
        onClose={handleCloseConnectPhone}
        aria-labelledby="phone-dialog-title"
      >
        <DialogTitle id="phone-dialog-title">
          Connect a Phone Number
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can connect a phone number to be matched with! You will need to
            verify the phone after adding it. This will cost you one point!
          </DialogContentText>

          <MuiPhoneNumber defaultCountry={'us'} onChange={setPhone} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConnectPhone} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitConnectPhone} color="primary">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openValidatePhone && phoneConnected}
        onClose={handleCloseValidatePhone}
        aria-labelledby="validate-phone"
      >
        <DialogTitle id="phone-dialog-title">Validate Phone Number</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the code you received by SMS to validate your phone
            number. If you did not reveive the code you can try to validate
            again!
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="token"
            label="Validation Code"
            type="number"
            onChange={setToken}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseValidatePhone} color="primary">
            Cancel
          </Button>
          <Button onClick={handleValidatePhone} color="primary">
            Validate
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

ConnectPhone.propTypes = {
  connectPhone: PropTypes.func.isRequired,
  clearPhoneStatus: PropTypes.func.isRequired,
  validatePhone: PropTypes.func.isRequired,
  OpenConnectPhone: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  openPhone: state.navigation.openPhone,
  phoneConnected: state.users.phoneConnected,
  phoneValidated: state.users.phoneValidated
});

export default connect(mapStateToProps, {
  connectPhone,
  clearPhoneStatus,
  validatePhone,
  OpenConnectPhone
})(ConnectPhone);
