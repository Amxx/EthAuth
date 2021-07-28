import base64url             from 'base64url';
import { arrayify, hexlify } from '@ethersproject/bytes';

import { CAIP10,  ICAIP10  } from '../CAIP10';
import { Payload, IPayload } from './Payload';

export type IToken = {
  identity:  ICAIP10,
  payload:   IPayload,
  signature: string,
};

export class Token implements IToken {
  identity!:  CAIP10;
  payload!:   Payload;
  signature!: string;

  constructor(that: IToken) {
    Object.assign(this, that);
  }

  toString(): string {
    return [
      base64url.encode(this.identity.toString()),
      base64url.encode(this.payload.toString()),
      base64url.encode(Buffer.from(arrayify(this.signature)))
    ].join('.');
  }

  static fromObject(that: IToken): Token {
    return new Token(that);
  }

  static fromString(str: string): Token {
    const [ identity, payload, signature ] = str.split('.');
    return new Token({
      identity:  CAIP10.fromString(base64url.decode(identity)),
      payload:   Payload.fromString(base64url.decode(payload)),
      signature: hexlify(base64url.toBuffer(signature)),
    });
  }
}
