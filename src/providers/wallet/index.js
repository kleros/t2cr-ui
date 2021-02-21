import { Web3Provider } from "@ethersproject/providers";
import {
  Web3ReactProvider as _Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ConnectorNames,
  authereum,
  frame,
  injected,
  torus,
  walletconnect,
} from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hooks";

export { ConnectorNames };

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Authereum]: authereum,
  [ConnectorNames.Torus]: torus,
  [ConnectorNames.Frame]: frame,
};

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export function Web3ReactProvider({ children }) {
  return (
    <_Web3ReactProvider getLibrary={getLibrary}>{children}</_Web3ReactProvider>
  );
}

const Context = createContext();

export function useWallet() {
  return useContext(Context);
}

export default function WalletProvider({ children }) {
  const web3ReactContext = useWeb3React();
  const { connector, account } = web3ReactContext;

  // Handle logic to recognize the connector currently being activated.
  const [activatingConnector, setActivatingConnector] = React.useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector();
  }, [activatingConnector, connector]);

  // Handle logic to eagerly connect to the injected ethereum provider,
  // if it exists and has granted access already.
  const triedEager = useEagerConnect();

  // Handle logic to connect in reaction to certain events on the
  // injected ethereum provider, if it exists.
  useInactiveListener(!triedEager || !!activatingConnector);

  // This is used for the app-wide wallet modal. When a user
  // clicks a button to write to the blockchain, we verify that they
  // have a wallet connecte, if not we display a modal controlled.
  // by this state.
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const closeWalletModal = useCallback(() => setWalletModalOpen(false), []);
  const walletModalControls = useMemo(
    () => ({
      walletModalOpen,
      setWalletModalOpen,
      closeWalletModal,
    }),
    [closeWalletModal, walletModalOpen]
  );
  // Close modal once we get a connection.
  useEffect(() => {
    if (!account) return;
    closeWalletModal();
  }, [account, closeWalletModal]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          ...web3ReactContext,
          triedEager,
          activatingConnector,
          setActivatingConnector,
          walletModalControls,
        }),
        [activatingConnector, triedEager, walletModalControls, web3ReactContext]
      )}
    >
      {children}
    </Context.Provider>
  );
}
