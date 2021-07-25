import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Auth   from './endpoints/Auth';
import Verify from './endpoints/Verify';

const App = () =>
  <Router>
    <Switch>
      <Route path='/oauth2/auth'   component={Auth}   />
      <Route path='/oauth2/verify' component={Verify} />
    </Switch>
  </Router>;

export default App;
