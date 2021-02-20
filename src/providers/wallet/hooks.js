import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

import { injected } from "./connectors";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [mounted, setMounted] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (mounted) return;
    setMounted(true);
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized)
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      else setTried(true);
    });
  }, [activate, mounted]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) setTried(true);
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };
      const handleChainChanged = () => {
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleConnect);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
