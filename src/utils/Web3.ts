import {
  Provider,
  ExternalProvider,
  Web3Provider,
  JsonRpcProvider,
} from '@ethersproject/providers';

import { chains, Chain } from 'eth-chains'

function revert(reason = ''): never {
  throw new Error(reason);
}

export function getProviderByChainId(chainid: number | string): Provider {
  const chain: Chain | undefined = chains.getById(+chainid);

  if (chain === undefined) { throw new Error(`Unknown chainid ${chainid}`); }

  const rpc: string | undefined = chain.rpc
    .map((str: string) => {
      try {
        return str.replace(/\$\{(\w+)\}/g, (_, varname) => process.env[varname] || revert() );
      } catch (_) {
        return undefined;
      }
    })
    .find((x: string | undefined) => x !== undefined && (x.startsWith('http://') || x.startsWith('https://')));

  if (rpc === undefined) { throw new Error(`No valid endpoint for chain ${JSON.stringify(chain)}. Environment variables might be required`); }

  return new JsonRpcProvider(rpc);
}

export function tryGetProvider(ethereum: ExternalProvider & { enable?: () => Promise<void> }): Promise<Web3Provider> {
  return new Promise((resolve, reject) => {
    if (ethereum.enable) {
      ethereum.enable()
        .then(() => resolve(new Web3Provider(ethereum)))
        .catch(reject);
    } else if (ethereum.request) {
      ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => resolve(new Web3Provider(ethereum)))
        .catch(reject);
    } else if (ethereum.send) {
      ethereum.send({ method: 'eth_requestAccounts' }, (error) => error ? reject() : resolve(new Web3Provider(ethereum)));
    } else if (ethereum.sendAsync) {
      ethereum.sendAsync({ method: 'eth_requestAccounts' }, (error) => error ? reject() : resolve(new Web3Provider(ethereum)));
    } else {
      reject();
    }
  });
}
