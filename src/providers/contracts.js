import { gql, useQuery } from "@apollo/client";
import { ethers } from "ethers";
import React, { createContext, useContext, useMemo } from "react";

import _arbitratorABI from "../assets/abis/arbitratorABI";
import _t2crABI from "../assets/abis/t2crABI";

import { useWallet } from "./wallet";

const Context = createContext();

export function useContracts() {
  return useContext(Context);
}

const registryQuery = gql`
  query registryQuery {
    registries(first: 1) {
      sharedStakeMultiplier
      requesterBaseDeposit
      arbitrator
      arbitratorExtraData
    }
  }
`;

// Depends on wallet provider and apollo provider.
export default function ContractsProvider({ children }) {
  const { account, library, chainId, active } = useWallet();
  const t2cr = useMemo(() => {
    if (!active) return;

    const provider = account ? library.getSigner() : library;
    const t2crAddress = JSON.parse(process.env.REACT_APP_T2CR_ADDRESSES)[
      chainId
    ];
    return new ethers.Contract(t2crAddress, _t2crABI, provider);
  }, [account, active, chainId, library]);

  const { data: registryData } = useQuery(registryQuery);
  const registry = (registryData && registryData.registries[0]) || {};
  const { arbitrator: arbitratorAddress } = registry || {};

  const arbitrator = useMemo(() => {
    if (!active || !arbitratorAddress) return;

    const provider = account ? library.getSigner().connectUnchecked() : library;
    return new ethers.Contract(arbitratorAddress, _arbitratorABI, provider);
  }, [account, active, arbitratorAddress, library]);

  return (
    <Context.Provider
      value={useMemo(
        () => ({
          t2cr,
          arbitrator,
        }),
        [arbitrator, t2cr]
      )}
    >
      {children}
    </Context.Provider>
  );
}
