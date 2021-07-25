import * as React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import Login  from './endpoints/Login';
import Auth   from './endpoints/Auth';
import Verify from './endpoints/Verify';

const App = () =>
  <Router>
    <Switch>
      <Route exact path='/'><Redirect to='/login'/></Route>
      <Route path='/login'  component={Login}  />
      <Route path='/oauth2' component={Auth}   />
      <Route path='/verify' component={Verify} />
    </Switch>
  </Router>;

export default App;
