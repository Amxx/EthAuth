import { TypedDataField } from '@ethersproject/abstract-signer';

export type CAIP10 = {
  namespace: string,
  reference: string,
  account:   string,
};

export function fromString(str: string): CAIP10 {
  const matched = str.match(/^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-a-zA-Z0-9]{1,32}):(?<account>(0x)?[a-zA-Z0-9]{1,64})$/);
  if (!matched) { throw new Error('Invalid identity format (CAIP10 expected)'); }
  return matched.groups as unknown as CAIP10;
};

export function toString(caip10: CAIP10): string {
  if (caip10.namespace.search(/^[-a-z0-9]{3,8}$/)       === -1) { throw new Error('Invalid namespace format'); }
  if (caip10.reference.search(/^[-a-zA-Z0-9]{1,31}$/)   === -1) { throw new Error('Invalid reference format'); }
  if (caip10.account.search(/^(0x)?[a-zA-Z0-9]{1,64}$/) === -1) { throw new Error('Invalid account format');   }
  return [ caip10.namespace, caip10.reference, caip10.account ].join(':');
};

export function toTypedDataFieldArray(caip10: CAIP10): Record<string, Array<TypedDataField>> {
  return {
    CAIP10: [
      { name: 'namespace', type: 'string' },
      { name: 'reference', type: 'string' }, // use uint256 ?
      { name: 'account',   type: 'string' }, // use address ?
    ],
  };
};
