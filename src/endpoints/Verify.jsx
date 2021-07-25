import * as React     from 'react';
import * as Web3OAuth from '../utils/Web3OAuth';

const Verify = ({ location }) => {
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);

    Web3OAuth.verifyToken(JSON.parse(Buffer.from(params.get('token'), 'base64').toString('ascii'))).then(console.log);

  }, [ location.search ]);

  return null;
}

export default Verify;
