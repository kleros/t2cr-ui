import { Global } from "@emotion/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useStorageReducer } from "react-storage-hooks";
import usePromise from "react-use-promise";
import Web3 from "web3";

export const createWeb3 = (infuraURL) => {
  const web3 = new Web3(infuraURL);

  web3.infuraURL = infuraURL;
  return web3;
};
export const createWeb3FromModal = async (modal, infuraURL) => {
  const web3 = new Web3(await modal.connect());
  web3.modal = modal;
  web3.infuraURL = infuraURL;
  return web3;
};
const Context = createContext();
export default function Web3Provider({
  infuraURL,
  contracts,
  onNetworkChange,
  children,
}) {
  const [web3, setWeb3] = useState(() => createWeb3(infuraURL));
  useEffect(() => {
    if (infuraURL !== web3.infuraURL) setWeb3(createWeb3(infuraURL));
  }, [infuraURL, web3.infuraURL]);
  useEffect(() => {
    (async () => {
      if (web3.modal.cachedProvider)
        setWeb3(await createWeb3FromModal(web3.modal, web3.infuraURL));
    })();
  }, [web3.modal, web3.infuraURL]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ETHNetID = await web3.eth.net.getId();
      if (!cancelled && ETHNetID !== web3.ETHNet?.ID) {
        web3.ETHNet = {
          ID: ETHNetID,
          name: { 42: "kovan", 1: "mainnet" }[ETHNetID],
        };
        setWeb3({ ...web3 });
        if (onNetworkChange) onNetworkChange(web3.ETHNet);
      }

      if (contracts !== web3._contracts) {
        const [account] = await web3.eth.getAccounts();
        if (!cancelled) {
          web3.contracts = contracts.reduce(
            (acc, { name, abi, address, options }) => {
              acc[name] = new web3.eth.Contract(
                abi,
                address[web3.ETHNet.name],
                {
                  from: account,
                  ...options,
                }
              );
              acc[name].jsonInterfaceMap = acc[name]._jsonInterface.reduce(
                (_acc, method) => {
                  _acc[method.name] = method;
                  return _acc;
                },
                {}
              );
              return acc;
            },
            {}
          );
          web3._contracts = contracts;
          setWeb3({ ...web3 });
        }
      }
    })();
    return () => (cancelled = true);
  }, [web3, onNetworkChange, contracts]);
  return (
    <Context.Provider
      value={useMemo(
        () => ({
          web3,
          setWeb3,
          async connect() {
            web3.modal.clearCachedProvider();
            setWeb3(await createWeb3FromModal(web3.modal, web3.infuraURL));
          },
        }),
        [web3, setWeb3]
      )}
    >
      <Global styles={{ ".web3modal-modal-lightbox": { zIndex: 1000 } }} />
      {children}
    </Context.Provider>
  );
}

export function useWeb3(namespace, method, args) {
  const isNotCall = !namespace || !method;

  const web3Context = useContext(Context);
  const data = usePromise(
    () =>
      !isNotCall &&
      [...namespace.split("."), method].reduce(
        (acc, key) => acc[key],
        web3Context.web3
      )(...(args || [])),
    [isNotCall, namespace, method, web3Context, args]
  );

  return isNotCall ? web3Context : data;
}

const sendStateReducer = (
  state,
  { type, transactionHash, confirmation, receipt, error }
) => {
  switch (type) {
    case "transactionHash":
      return { transactionHash };
    case "confirmation":
      return { ...state, confirmation };
    case "receipt":
      return { ...state, receipt };
    case "error":
      return { ...state, error };
  }
};
const parseRes = (value, web3) =>
  typeof value === "boolean" ||
  Number.isNaN(Number(value)) ||
  value.startsWith("0x")
    ? value
    : web3.utils.toBN(value);
export function useContract(
  contract,
  method,
  { address, type, args, options } = {}
) {
  const { web3, connect } = useWeb3();
  const contractName = contract;
  contract = useMemo(() => {
    let _contract = web3.contracts?.[contract];
    if (_contract && address && _contract.options.address !== address) {
      const jsonInterfaceMap = _contract.jsonInterfaceMap;
      _contract = _contract.clone();
      _contract.options.address = address;
      _contract.jsonInterfaceMap = jsonInterfaceMap;
    }
    return _contract;
  }, [web3.contracts, contract, address]);
  type =
    type ||
    (contract &&
      method &&
      (contract.jsonInterfaceMap[method].constant ? "call" : "send"));
  const run = useCallback(
    (_args, _options) =>
      contract &&
      method &&
      (!args ||
        args.findIndex((value) => value === undefined || value === null) ===
          -1) &&
      contract.methods[method](...(args || []), ...(_args || []))[type]({
        ...options,
        ..._options,
      }),
    [contract, method, args, type, options]
  );
  const isSend = type === "send";

  const [sendState, dispatch] = useStorageReducer(
    localStorage,
    JSON.stringify({ contract: contractName, method, type }),
    sendStateReducer,
    {}
  );
  const send = useCallback(
    async (...__args) => {
      if (!contract.options.from) await connect();

      let _args;
      let _options;
      if (typeof __args[__args.length - 1] === "object") {
        _args = __args.slice(0, -1);
        _options = __args[__args.length - 1];
      } else _args = __args;
      return new Promise((resolve) =>
        run(_args, _options)
          .on("transactionHash", (transactionHash) =>
            dispatch({ type: "transactionHash", transactionHash })
          )
          .on("confirmation", (confirmation) =>
            dispatch({ type: "confirmation", confirmation })
          )
          .on("receipt", (receipt) => {
            dispatch({ type: "receipt", receipt });
            resolve(receipt);
          })
          .on("error", (error) => {
            dispatch({ type: "error", error });
            resolve(error);
          })
      );
    },
    [contract, connect, run, dispatch]
  );
  const [receipt] = usePromise(
    () =>
      sendState.transactionHash &&
      !sendState.receipt &&
      new Promise((resolve) => {
        const poll = async () => {
          const _receipt = await web3.eth.getTransactionReceipt(
            sendState.transactionHash
          );
          if (_receipt) resolve(_receipt);
          else setTimeout(poll, 2000);
        };
        poll();
      }),
    [sendState.transactionHash, sendState.receipt, web3]
  );

  const [reCallRef, reCall] = useReducer(() => ({}), {});
  const data = usePromise(
    () =>
      reCallRef &&
      type &&
      !isSend &&
      run().then?.((res) =>
        typeof res === "object"
          ? Object.keys(res).reduce((acc, key) => {
              acc[key] = parseRes(res[key], web3);
              return acc;
            }, {})
          : parseRes(res, web3)
      ),
    [reCallRef, type, isSend, run, web3]
  );

  return isSend
    ? {
        receipt,
        ...sendState,
        send,
        loading:
          sendState.transactionHash &&
          !sendState.receipt &&
          !receipt &&
          !sendState.error,
      }
    : [...data, reCall];
}
