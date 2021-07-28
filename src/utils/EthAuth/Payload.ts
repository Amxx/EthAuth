import { BigNumberish } from '@ethersproject/bignumber';

export type IPayload = {
  app:   string,
  iat:   BigNumberish,
  exp:   BigNumberish,
  salt?: BigNumberish,
  typ?:  string,
  ogn?:  string,
};

export class Payload implements IPayload {
  app!:  string
  iat!:  BigNumberish
  exp!:  BigNumberish
  salt?: BigNumberish
  typ?:  string
  ogn?:  string

  constructor(that: IPayload) {
    Object.assign(this, that);
  }

  toString(): string {
    return JSON.stringify({
      app:  this.app,
      iat:  this.iat,
      exp:  this.exp,
      salt: this.salt,
      typ:  this.typ,
      ogn:  this.ogn,
    });
  }

  static fromObject(that: IPayload): Payload {
    return new Payload(that);
  }

  static fromString(str: string): Payload {
    return new Payload(JSON.parse(str));
  }
}
