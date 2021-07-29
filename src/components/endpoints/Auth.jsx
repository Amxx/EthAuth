import * as React from 'react';
import * as Web3  from '../../utils/Web3';

import WalletConnectProvider from '@walletconnect/web3-provider';

import { TokenManager }      from '../../utils/EthAuth';
import Loading               from './Loading';


const WALLETCONNECT_CONFIG = {
  infuraId: '9D13ZE7XSBTJ94N9BNJ2MA33VMAY2YPIRB',
}

const Auth = ({ location }) => {
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);

    [
      () => window.ethereum,
      () => new WalletConnectProvider(WALLETCONNECT_CONFIG),
    ]
    .reduce(
      (provider, gen) => provider.then(() => provider).catch(() => Web3.tryGetProvider(gen())),
      Promise.reject(),
    )
    .then(provider => TokenManager.signToken(
      provider.getSigner(0),
      {
        aud: params.get('clientId') || '*',
        red: params.get('redirect_uri'),
        iat: (Date.now() / 1000 | 0),
        exp: (Date.now() / 1000 | 0) + 86400,
      },
    ))
    .then(token => {
      window.location = `${params.get('redirect_uri')}?token=${token.toString()}`;
    })
    .catch(error => {
      window.location = `${params.get('redirect_uri')}?error=${error.message}`;
    });

  }, [ location.search ]);

  return <Loading/>;
};

export default Auth;
