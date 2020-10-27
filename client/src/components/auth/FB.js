import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
export class Logintbyfacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  signup(res) {
    const responseFacebook = {
      Name: res.name,
      email: res.email,
      token: res.accessToken,
      Image: res.picture.data.url,
      ProviderId: 'Facebook'
    };

    debugger;
    axios.post('/api/v1/users/fb', responseFacebook).then(result => {
      let responseJson = result;
      console.log(result.data.name);
      alert('data');
      sessionStorage.setItem('userData', JSON.stringify(result));
      this.props.history.push('/welcome');
    });
  }
  render() {
    const responseFacebook = response => {
      console.log(response);
      var res = response.profileObj;
      console.log(res);
      debugger;
      this.signup(response);
    };
    return (
      <FacebookLogin
        buttonStyle={{ padding: '6px' }}
        appId="380772783291898"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
      />
    );
  }
}
