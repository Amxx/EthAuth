import {
  isAddress,
} from "@ethersproject/address";

import {
  BigNumber,
  BigNumberish,
} from '@ethersproject/bignumber';

import {
  arrayify,
} from "@ethersproject/bytes";

import {
  MaxUint256,
  MinInt256,
} from '@ethersproject/constants';

// BigNumber | Bytes | bigint | string | number → boolean, int256, uint256, bytes32, bytes, string
export function inferType(value: BigNumberish): string {
  switch (typeof value) {
    case 'boolean':
    return 'boolean';

    case 'object':
    return ((value as BigNumber)._isBigNumber)
    ? (value as BigNumber).lt(0)
    ? 'int256'
    : 'uint256'
    : 'bytes';

    case 'bigint':
    return 'uint256';

    case 'number':
    return value < 0 ? 'int256' : 'uint256';

    case 'string':
    if (isAddress(value)) {
      return 'address';
    }

    // numbers
    if (!value.startsWith('0x')) {
      try {
        const bn = BigNumber.from(value);
        if (bn.gte(0) && bn.lte(MaxUint256)) return 'uint256';
        if (bn.lt(0)  && bn.gte(MinInt256))  return 'int256';
      } catch (_) {}
    }

    // bytes types
    try {
      const { length } = arrayify(value);
      return length === 32 ? 'bytes32' : 'bytes';
    } catch (_) {}

    return 'string';
  }
};
