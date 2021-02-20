import { useEffect, useRef } from "react";

import { itemStatusEnum } from "../data";

export const isResolved = (status) =>
  status === itemStatusEnum.Registered.key ||
  status === itemStatusEnum.Absent.key;

export const truncateEthAddr = (ethAddr) => {
  const start = ethAddr.slice(0, 6);
  const end = ethAddr.slice(-4);
  return `${start}...${end}`;
};

export const chainIdToName = (chainId) => {
  if (!chainId && chainId !== 0) return "Not connected";
  switch (chainId) {
    case 1:
      return "mainnet";
    case 42:
      return "kovan";
    default:
      throw new Error(`Unknown name for chainId ${chainId}`);
  }
};

export const chainIdToColor = (chainId) => {
  if (!chainId && chainId !== 0) return "#f60c36";
  switch (chainId) {
    case 1:
      return "#29b6af";
    case 42:
      return "#9064ff";
    default:
      throw new Error(`Unknown color for chainId ${chainId}`);
  }
};

export const upload = (fileName, buffer) =>
  fetch("https://ipfs.kleros.io/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      buffer: Buffer.from(buffer),
    }),
  })
    .then((res) => res.json())
    .then(
      ({ data }) =>
        new URL(`https://ipfs.kleros.io/ipfs/${data[1].hash}${data[0].path}`)
    );

export const chainIdToEtherscanName = {
  1: "",
  42: "kovan.",
};

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (typeof savedCallback?.current !== "undefined")
        savedCallback?.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
