export type CAIP10 = {
  namespace: string,
  reference: string,
  account:   string,
};

export function parse(id: string) : CAIP10 {
  const matched = id.match(/^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-a-zA-Z0-9]{1,32}):(?<account>(0x)?[a-zA-Z0-9]{1,64})$/);
  if (!matched || !matched.groups) { throw new Error('Invalid CAIP10 format'); }
  return {
    namespace: matched.groups['namespace'],
    reference: matched.groups['reference'],
    account:   matched.groups['account'],
  };
};

export function merge({ namespace, reference, account }: CAIP10) : string {
  if (namespace.search(/^[-a-z0-9]{3,8}$/)       === -1) { throw new Error('Invalid namespace format'); }
  if (reference.search(/^[-a-zA-Z0-9]{1,31}$/)   === -1) { throw new Error('Invalid reference format'); }
  if (account.search(/^(0x)?[a-zA-Z0-9]{1,64}$/) === -1) { throw new Error('Invalid account format'); }
  return `${namespace}:${reference}:${account}`;
};
