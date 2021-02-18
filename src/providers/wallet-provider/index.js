import { Web3Provider } from "@ethersproject/providers";
import {
  Web3ReactProvider as _Web3ReactProvider,
  useWeb3React,
} from "@web3-react/core";
import React, { createContext, useContext, useEffect, useMemo } from "react";

import { useEagerConnect, useInactiveListener } from "./hooks";

export { ConnectorNames, injected } from "./connectors";

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
  const { connector } = web3ReactContext;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector)
      setActivatingConnector();
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          ...web3ReactContext,
          triedEager,
          activatingConnector,
          setActivatingConnector,
        }),
        [activatingConnector, triedEager, web3ReactContext]
      )}
    >
      {children}
    </Context.Provider>
  );
}
