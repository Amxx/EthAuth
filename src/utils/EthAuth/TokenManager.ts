import {
  Signer,
  TypedDataSigner,
  TypedDataDomain,
} from '@ethersproject/abstract-signer';

import { Contract          } from '@ethersproject/contracts';
import { getAddress        } from '@ethersproject/address';
import { _TypedDataEncoder } from '@ethersproject/hash';
import { recoverAddress    } from '@ethersproject/transactions';

import * as CAIP10  from '../CAIP10';
import * as Payload from './Payload';
import * as Token   from './Token';

import { getProviderByChainId  } from '../Web3';

const ERC1271ABI = [ 'function isValidSignature(bytes32, bytes) public view returns (bytes4)' ];

const domain: TypedDataDomain = {
  name:    'LoginWithEthereum',
  version: '0.1.0',
};

export async function signToken(signer: Signer & TypedDataSigner, payload: Payload.Payload): Promise<string> {
  if (!signer.provider) throw new Error('Signer is missing a provider');

  const account:   string = await signer.getAddress();
  const reference: string = await signer.provider.getNetwork().then(({ chainId }) => chainId.toString());
  const identity:  CAIP10.CAIP10 = { namespace: 'evm', reference, account };
  const signature: string = await signer._signTypedData(
    domain,
    Token.toTypedDataFieldArray({ identity, payload, signature: '' }),
    { identity, payload },
  );
  return Token.toString({ identity, payload, signature });
};

export async function verifyToken(token: string): Promise<{ isValid: boolean, account?: string}> {
  const { identity, payload, signature } = Token.fromString(token);

  var isValid: boolean;
  switch (identity.namespace) {
    case 'evm':
      // ERC712 hash
      const structHash = _TypedDataEncoder.hash(
        domain,
        Token.toTypedDataFieldArray({ identity, payload }),
        { identity, payload },
      );

      isValid = await [
        // Check EOA
        () => getAddress(identity.account) === recoverAddress(structHash, signature),
        // Fallback, check 1271
        () => {
          const contract = new Contract(identity.account, ERC1271ABI, getProviderByChainId(identity.reference));
          return contract
            .isValidSignature(structHash, signature)
            .then((result: string) => result === '0x1626ba7e')
            .catch(() => false);
        },
      ].reduce(
        (result, resolution) => result.then(x => x || resolution()),
        Promise.resolve(false),
      );
      break;

    default:
      isValid = false;
      break;
  }

  return Object.assign(
    { isValid },
    isValid && { account: identity.account },
  );
};
