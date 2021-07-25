import { ExternalProvider, Web3Provider } from '@ethersproject/providers'

export function tryGetProvider(ethereum: ExternalProvider) {
  return new Promise((resolve, reject) => {
    if ((ethereum as any).enable) {
      (ethereum as any).enable()
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
