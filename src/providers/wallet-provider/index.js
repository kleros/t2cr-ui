import { Web3Provider } from "@ethersproject/providers";
import {
  Web3ReactProvider as _Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core";
import { ethers } from "ethers";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStorageState } from "react-storage-hooks";

import _t2crABI from "../../assets/t2crABI";

import {
  ConnectorNames,
  authereum,
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
  const { connector, account, chainId, library } = web3ReactContext;
  const t2cr = useMemo(() => {
    if (!account) return;
    const signer = library.getSigner();
    const t2crAddress = JSON.parse(process.env.REACT_APP_T2CR_ADDRESSES)[
      chainId
    ];
    return new ethers.Contract(
      t2crAddress,
      _t2crABI,
      signer.connectUnchecked()
    );
  }, [account, chainId, library]);

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

  // Transaction state management.
  const TX_STORAGE_KEY = "TX_STORAGE_KEY";
  const [txes, setTxes] = useStorageState(localStorage, TX_STORAGE_KEY, {});
  const newTx = useCallback(
    (tx) => {
      setTxes((previousState) => ({ ...previousState, tx }));
      // TODO: Trigger new notification popup.
    },
    [setTxes]
  );
  // Periodically check if any pending transactions were mined.
  const [pollingActivity, setPollingActivity] = useState(false);
  useEffect(() => {
    if (pollingActivity) return;
    setPollingActivity(true);
    setInterval(() => {
      // Update mined transactions.
      Object.entries(txes)
        .filter(([, tx]) => tx.confirmations && tx.confirmations <= 0)
        .forEach(async ([txHash]) => {
          const latestTxReceipt = await library.getTransaction(txHash);

          // Some providers may return null if the tx was not
          // mined yet.
          if (!latestTxReceipt) return;
          if (
            !latestTxReceipt.confirmations ||
            latestTxReceipt.confirmations <= 0
          )
            return;

          // Transaction mined. Dispatch update.
          // If tx includes a log with a tokenID,
          // include it the tx object.
          const statusChangeLogs = latestTxReceipt.logs
            .map((log) => t2cr.interface.parseLog(log))
            .filter((log) => log.name === "TokenStatusChange");
          if (statusChangeLogs.length > 0)
            latestTxReceipt.tokenID = statusChangeLogs[0].args._tokenID;

          setTxes((previousState) => ({
            ...previousState,
            [txHash]: latestTxReceipt,
          }));
        });
    }, 5 * 1000);
  }, [library, pollingActivity, setTxes, t2cr.interface, txes]);
  const txManagement = useMemo(() => ({ newTx, txes }), [newTx, txes]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          ...web3ReactContext,
          triedEager,
          activatingConnector,
          setActivatingConnector,
          walletModalControls,
          t2cr,
          txManagement,
        }),
        [
          activatingConnector,
          t2cr,
          triedEager,
          txManagement,
          walletModalControls,
          web3ReactContext,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}
