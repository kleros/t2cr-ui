import { AuthereumConnector } from "@web3-react/authereum-connector";
import { FrameConnector } from "@web3-react/frame-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const ConnectorNames = {
  Injected: "Injected",
  WalletConnect: "WalletConnect",
  Authereum: "Authereum",
  Torus: "Torus",
  Frame: "Frame",
};

export const injected = new InjectedConnector({ supportedChainIds: [1, 42] });

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: JSON.parse(process.env.REACT_APP_T2CR_ADDRESSES)[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

export const authereum = new AuthereumConnector({ chainId: 1 });

export const torus = new TorusConnector({ chainId: 1 });

export const frame = new FrameConnector({ supportedChainIds: [1] });
