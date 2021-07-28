import {
  Signer,
  TypedDataSigner,
  TypedDataDomain,
  TypedDataField,
} from '@ethersproject/abstract-signer';

import { Contract          } from '@ethersproject/contracts';
import { getAddress        } from '@ethersproject/address';
import { _TypedDataEncoder } from '@ethersproject/hash';
import { recoverAddress    } from '@ethersproject/transactions';

import { CAIP10               } from '../CAIP10';
import { Payload, IPayload    } from './Payload';
import { Token,   IToken      } from './Token';
import { getProviderByChainId } from '../Web3';

const ERC1271ABI = [ 'function isValidSignature(bytes32, bytes) public view returns (bytes4)' ];

export class TokenManager {
  static readonly domain: TypedDataDomain = {
    name:    'LoginWithEthereum',
    version: '0.1.0',
  };

  static buildTypes(payload: Payload): Record<string, Array<TypedDataField>> {
    return {
      EthAuthToken: [
        { name: 'identity', type: 'CAIP10'  },
        { name: 'payload',  type: 'Payload' },
      ],
      CAIP10: [
        { name: 'namespace', type: 'string' },
        { name: 'reference', type: 'string' }, // use uint256 ?
        { name: 'account',   type: 'string' }, // use address ?
      ],
      Payload: [
        payload.app  && { name: 'app',  type: 'string'  },
        payload.iat  && { name: 'iat',  type: 'uint256' },
        payload.exp  && { name: 'exp',  type: 'uint256' },
        payload.salt && { name: 'salt', type: 'bytes32' },
        payload.typ  && { name: 'typ',  type: 'string'  },
        payload.ogn  && { name: 'ogn',  type: 'string'  },
      ].filter(Boolean) as Array<TypedDataField>,
    };
  }

  static async signToken(signer: Signer & TypedDataSigner, payload: IPayload): Promise<Token> {
    payload = Object.setPrototypeOf(payload, Payload.prototype);

    if (!signer.provider) throw new Error('Signer is missing a provider');

    const account:   string = await signer.getAddress();
    const reference: string = await signer.provider.getNetwork().then(({ chainId }) => chainId.toString());
    const identity:  CAIP10 = CAIP10.fromObject({ namespace: 'evm', reference, account });
    const signature: string = await signer._signTypedData(
      TokenManager.domain,
      TokenManager.buildTypes(payload),
      { identity, payload },
    );
    return Token.fromObject({ identity, payload, signature });
  }

  static async verifyToken(token: IToken | string): Promise<{ isValid: boolean, account?: string}> {
    const { identity, payload, signature } = typeof(token) === 'string' ? Token.fromString(token) : token;

    var isValid: boolean;
    switch (identity.namespace) {
      case 'evm':
        // ERC712 hash
        const structHash = _TypedDataEncoder.hash(
          TokenManager.domain,
          TokenManager.buildTypes(payload),
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
  }
}
