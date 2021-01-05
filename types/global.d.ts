declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_IPFS_GATEWAY: string;
  }
}

interface Token {
  name: string;
  ticker: string;
  symbolMultihash: string;
  status: string;
  address: string;
}
