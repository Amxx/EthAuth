import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { getAddress                      } from '@ethersproject/address';
import { BigNumberish                    } from '@ethersproject/bignumber';
import { JsonRpcProvider                 } from '@ethersproject/providers';
import { verifyTypedData                 } from '@ethersproject/wallet';

import * as CAIP10 from './CAIP10';

export type Web3OauthToken = {
  aud: string,
  sub: string,
  iat: BigNumberish,
  sig: string,
};

export const domain: TypedDataDomain = {
  name:    'LoginWithEthereum',
  version: '0.1.0',
};

export const types: Record<string, Array<TypedDataField>> = {
  OAuth: [
    { name: 'aud', type: 'string'  },
    { name: 'sub', type: 'string'  },
    { name: 'iat', type: 'uint256' },
  ]
};

export async function signToken(provider: JsonRpcProvider, aud: string, iat: BigNumberish) : Promise<Web3OauthToken> {
  iat = iat ?? (Date.now() / 1000 | 0);

  const chainId = await provider.getNetwork().then(({ chainId }) => chainId);
  const address = await provider.getSigner(0).getAddress();
  const sub     = CAIP10.merge({ namespace: 'evm', reference: chainId.toString(), account: address });

  return provider.getSigner(address)._signTypedData(
    domain, // add chainId?
    types,
    { aud, sub, iat },
  ).then(sig => ({ aud, sub, iat, sig }));
};

export async function verifyToken({ aud, sub, iat, sig }: Web3OauthToken) : Promise<Boolean> {
  // TODO: check iat in the past
  const { namespace, reference, account } = CAIP10.parse(sub);

  switch (namespace) {
    case 'evm':
      return getAddress(account) === verifyTypedData(
        domain, // add chainId?
        types,
        { aud, sub, iat },
        sig
      );
      // TODO: fallback to 1271 (requiers a provider)

    default:
      return false;
  }
};
