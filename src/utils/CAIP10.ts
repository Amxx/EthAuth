export type ICAIP10 = {
  namespace: string,
  reference: string,
  account:   string,
};

export class CAIP10 implements ICAIP10 {
  namespace!: string;
  reference!: string;
  account!:   string;

  constructor(that: ICAIP10) {
    Object.assign(this, that);
  }

  toString(): string {
    if (this.namespace.search(/^[-a-z0-9]{3,8}$/)       === -1) { throw new Error('Invalid namespace format'); }
    if (this.reference.search(/^[-a-zA-Z0-9]{1,31}$/)   === -1) { throw new Error('Invalid reference format'); }
    if (this.account.search(/^(0x)?[a-zA-Z0-9]{1,64}$/) === -1) { throw new Error('Invalid account format');   }
    return [ this.namespace, this.reference, this.account ].join(':');
  }

  static fromObject(that: ICAIP10): CAIP10 {
    return new CAIP10(that);
  }

  static fromString(identity: string): CAIP10 {
    const matched = identity.match(/^(?<namespace>[-a-z0-9]{3,8}):(?<reference>[-a-zA-Z0-9]{1,32}):(?<account>(0x)?[a-zA-Z0-9]{1,64})$/);
    if (!matched) { throw new Error('Invalid identity format (CAIP10 expected)'); }
    return new CAIP10(matched.groups as unknown as ICAIP10);
  }
}
