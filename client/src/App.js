import React, { Fragment } from 'react';
import store from './Store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Crushes from './components/pages/Crushes';
import Verify from './components/pages/Verify';
import VerifyInsta from './components/pages/VerifyInsta';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Forgot from './components/auth/Forgot';
import Footer from './components/layout/Footer';
import Welcome from './components/pages/Welcome';
import Match from './components/pages/Matches';
import Notifications from './components/pages/Notifications';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import ResetPassword from './components/auth/ResetPassword';
import NotConfirmed from './components/auth/NotConfirmed';
import ConfirmEmail from './components/auth/ConfirmEmail';
import ConfirmNetwork from './components/auth/ConfirmNetwork';
import Privacy from './components/layout/Privacy';
import MobileMenu from './components/layout/MobileMenu';
import Tutorial from './components/layout/Tutorial';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#9c4dcc',
      main: '#6a1b9a',
      dark: '#38006b',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ff6090',
      main: '#e91e63',
      dark: '#b0003a',
      contrastText: '#000000'
    },
    white: {
      main: '#ffffff'
    }
  }
});

const App = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <Fragment>
              <Alerts />
              <Navbar />
              <Switch>
                <Route exact path="/" component={Login} />
                <Route exact path="/privacy" component={Privacy} />
                <PrivateRoute exact path="/welcome" component={Welcome} />
                <PrivateRoute exact path="/crushes" component={Crushes} />
                <PrivateRoute exact path="/verify" component={Verify} />
                <PrivateRoute
                  exact
                  path="/verify-insta"
                  component={VerifyInsta}
                />
                <PrivateRoute exact path="/matches" component={Match} />
                <PrivateRoute
                  exact
                  path="/notifications"
                  component={Notifications}
                />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/forgot" component={Forgot} />
                <Route exact path="/notconfirmed" component={NotConfirmed} />
                <Route
                  exact
                  path="/reset/:email_token"
                  component={ResetPassword}
                />
                <Route
                  exact
                  path="/confirm/:email_token"
                  component={ConfirmEmail}
                />
                <Route
                  exact
                  path="/confirmnet/:email_token"
                  component={ConfirmNetwork}
                />
                <Route exact path="/tutorial" component={Tutorial} />
              </Switch>
              <MobileMenu />
              <Footer />
            </Fragment>
          </Router>
        </MuiThemeProvider>
      </Provider>
    </div>
  );
};

export default App;
