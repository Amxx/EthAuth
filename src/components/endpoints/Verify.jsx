import * as React from 'react';
import { Token, TokenManager } from '../../utils/EthAuth';

import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const Verify = ({ location }) => {
  const [ token, setToken ] = React.useState();
  const [ state, setState ] = React.useState({});

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get('token'));
  }, [ location.search ]);

  React.useEffect(() => {
    token && TokenManager.verifyToken(Token.fromString(token)).then(setState);
  }, [ token ]);

  return state.isValid === true  ? <Alert variant='success'   style={{ width: '80%', textAlign: 'center' }}><b>Token is valid</b></Alert>
       : state.isValid === false ? <Alert variant='danger'    style={{ width: '80%', textAlign: 'center' }}><b>Token is invalid</b></Alert>
       :                           <Alert variant='secondary' style={{ width: '80%', textAlign: 'center' }}><b>Checking token validity...</b></Alert>
}

export default Verify;
