import * as React     from 'react';
import * as Web3OAuth from '../../utils/Web3OAuth';

import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';

const Verify = ({ location }) => {
  const [ token, setToken ] = React.useState();
  const [ state, setState ] = React.useState();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get('token'));
  }, [ location.search ]);

  React.useEffect(() => {
    token && Web3OAuth.verifyToken(JSON.parse(Buffer.from(token, 'base64').toString('ascii'))).then(setState);
  }, [ token ]);

  return state === true  ? <Alert variant='success'   style={{ width: '80%', textAlign: 'center' }}><b>Token is valid</b></Alert>
       : state === false ? <Alert variant='danger'    style={{ width: '80%', textAlign: 'center' }}><b>Token is invalid</b></Alert>
       :                   <Alert variant='secondary' style={{ width: '80%', textAlign: 'center' }}><b>Checking token validity...</b></Alert>
}

export default Verify;
