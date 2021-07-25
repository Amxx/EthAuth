import * as React from 'react';

const Login = ({ history }) => {

  const base = '/oauth2';
  const params = Object.entries({
    clientId: 'Sample app',
    redirect_uri: '/verify',
  }).map(kv => kv.join('=')).join('&');

  return <button onClick={ () => history.push(`${base}?${params}`) }>Login with Ethereum</button>;
}

export default Login;
