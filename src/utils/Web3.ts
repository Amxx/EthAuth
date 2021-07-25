import { ExternalProvider, Web3Provider } from '@ethersproject/providers'

export function tryGetProvider(ethereum: ExternalProvider) {

  return (ethereum as any).enable()
    .then(() => new Web3Provider(ethereum))
    .catch(() => Promise.reject());
}
