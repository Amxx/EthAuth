import { BigNumberish   } from '@ethersproject/bignumber';
import { TypedDataField } from '@ethersproject/abstract-signer';

import { inferType } from './inferType';

export type Payload = Record<string, BigNumberish>;

export function fromString(str: string): Payload {
  return JSON.parse(str);
};

export function toString(payload: Payload): string {
  return JSON.stringify(payload);
};

export function toTypedDataFieldArray(payload: Payload): Record<string, Array<TypedDataField>> {
  return {
    Payload: Object.entries(payload).map(([ name, value ]) => ({ name, type: inferType(value) })),
  };
};
