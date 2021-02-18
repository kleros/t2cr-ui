import { AuthereumConnector } from "@web3-react/authereum-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const RPC_URLS = {
  1: process.env.REACT_APP_RPC_URL_1,
};

export const ConnectorNames = {
  Injected: "Injected",
  WalletConnect: "WalletConnect",
  Authereum: "Authereum",
  Torus: "Torus",
};

export const injected = new InjectedConnector({ supportedChainIds: [1] });

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

export const authereum = new AuthereumConnector({ chainId: 1 });

export const torus = new TorusConnector({ chainId: 1 });
