import * as React     from 'react';
import * as Web3      from '../../utils/Web3';
import * as Web3OAuth from '../../utils/Web3OAuth';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Loading from './Loading';

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
    .then(provider => Web3OAuth.signToken(provider, params.get('clientId') || '*'))
    .then(token => {
      window.location = `${params.get('redirect_uri')}?token=${Buffer.from(JSON.stringify(token), 'ascii').toString('base64')}`;
    });

  }, [ location.search ]);

  return <Loading/>;
};

export default Auth;
