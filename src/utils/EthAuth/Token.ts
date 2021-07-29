import base64url             from 'base64url';
import { TypedDataField    } from '@ethersproject/abstract-signer';
import { arrayify, hexlify } from '@ethersproject/bytes';

import * as CAIP10  from '../CAIP10';
import * as Payload from './Payload';

export type PartialToken = {
  identity:  CAIP10.CAIP10,
  payload:   Payload.Payload,
  signature?: string,
};

export type Token = Required<PartialToken>;

export function fromString(str: string): Token {
  const [ identity, payload, signature ] = str.split('.');
  return {
    identity:  CAIP10.fromString(base64url.decode(identity)),
    payload:   Payload.fromString(base64url.decode(payload)),
    signature: hexlify(base64url.toBuffer(signature)),
  };
};

export function toString(token: Token): string {
  return [
    base64url.encode(CAIP10.toString(token.identity)),
    base64url.encode(Payload.toString(token.payload)),
    base64url.encode(Buffer.from(arrayify(token.signature)))
  ].join('.');
};

export function toTypedDataFieldArray(token: PartialToken): Record<string, Array<TypedDataField>> {
  return Object.assign(
    {
      EthAuthToken: [
        { name: 'identity', type: 'CAIP10'  },
        { name: 'payload',  type: 'Payload' },
      ],
    },
    CAIP10.toTypedDataFieldArray(token.identity),
    Payload.toTypedDataFieldArray(token.payload),
  );
};
