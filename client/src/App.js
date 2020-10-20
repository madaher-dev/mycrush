import React, { Fragment } from 'react';
import store from './Store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Footer from './components/layout/Footer';
import Welcome from './components/pages/Welcome';
import Alerts from './components/layout/Alerts';

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
              {/* <Alerts /> */}
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/welcome" component={Welcome} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                {/* <Route exact path='/about' component={About} />
                <Route exact path='/donate/:channel' component={Donate} /> */}
              </Switch>
              <Footer />
            </Fragment>
          </Router>
        </MuiThemeProvider>
      </Provider>
    </div>
  );
};

export default App;
