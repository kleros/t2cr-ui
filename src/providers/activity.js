import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useStorageState } from "react-storage-hooks";
import { toast } from "react-toastify";
import { useThemeUI } from "theme-ui";

import { TransactionToast } from "../components";
import { useInterval } from "../utils";

import { useContracts } from "./contracts";
import { useWallet } from "./wallet";

const Context = createContext();

export function useActivity() {
  return useContext(Context);
}

// Depends on contracts provider.
// This provider:
// - Saves transactions submitted by the user;
// - Displays a notification toast whenever the user submits
//   a new transaction;
// - Polls the blockchain to learn when a submitted transaction
//   was mined.
export default function ActivityProvider({ children }) {
  const { t2cr } = useContracts();
  const walletContext = useWallet();

  const { library } = walletContext;

  // Transaction state management.
  const TX_STORAGE_KEY = "TX_STORAGE_KEY";
  const [txes, setTxes] = useStorageState(localStorage, TX_STORAGE_KEY, {});
  const newTx = useCallback(
    (tx) => {
      setTxes((previousState) => ({
        ...previousState,
        [tx.hash]: { hash: tx.hash },
      }));
      toast(<TransactionToast tx={tx} />, {
        toastId: tx.hash,
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    },
    [setTxes]
  );

  // Periodically check if any pending transactions were mined.
  useInterval(() => {
    if (!t2cr) return;

    Object.entries(txes)
      .filter(([, tx]) => !tx.confirmations || tx.confirmations <= 0)
      .forEach(async ([, tx]) => {
        const latestTxReceipt = await library.getTransactionReceipt(tx.hash);

        // Some providers may return null if the tx was not
        // mined yet.
        if (!latestTxReceipt) return;
        if (
          !latestTxReceipt.confirmations ||
          latestTxReceipt.confirmations <= 0
        )
          return;

        const newTxObject = {
          ...tx,
          confirmations: latestTxReceipt.confirmations,
        };
        // Transaction mined. Dispatch update.
        // If tx includes a log with a tokenID,
        // include it the tx object.
        const statusChangeLogs = latestTxReceipt.logs
          .map((log) => t2cr.interface.parseLog(log))
          .filter((log) => log.name === "TokenStatusChange");
        if (statusChangeLogs.length > 0)
          newTxObject.tokenID = statusChangeLogs[0].args._tokenID;

        setTxes((previousState) => ({
          ...previousState,
          [tx.hash]: newTxObject,
        }));
        toast.update(tx.hash, {
          // eslint-disable-next-line react/display-name
          render: () => <TransactionToast tx={newTxObject} />,
          position: "top-right",
          hideProgressBar: false,
          autoClose: 10 * 1000,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      });
  }, 5 * 1000);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          newTx,
          txes,
        }),
        [newTx, txes]
      )}
    >
      {children}
    </Context.Provider>
  );
}
