import { Arbitrable, Arbitrator } from "./standards";
import * as hashingUtils from "./utils/hashing";
import isRequired from "./utils/isRequired";
import { getHttpUri, getURIProtocol } from "./utils/uri";

/**
 * Archon provides functionality for Arbitrator and Arbitrable Ethereum smart contracts
 * as defined in ERC 792 and ___insert_evidence_standard_ERC___.
 */
class Archon {
  // static methods
  static modules = { Arbitrable, Arbitrator };
  static version = "1.2.2";
  static utils = { ...hashingUtils, getHttpUri, getURIProtocol };
  // class methods
  modules = { Arbitrable, Arbitrator };
  version = "1.2.2";
  utils = { ...hashingUtils, getHttpUri, getURIProtocol };

  /**
   * Instantiates a new Archon instance that provides the public interface
   * to Kleros contracts and library. All params are required. To use an individual
   * portion of the API import a class and initialize it yourself.
   * @param {string} ethereumProvider - The Web3.js Provider instance you would like the
   *                 Kleros.js library to use for interacting with the
   *                 Ethereum network.
   * @param {string} ipfsGatewayURI - The URI of a trusted IPFS gateway in order to fetch
   *                 files from the IPFS network. Defaults to "https://gateway.ipfs.io"
   */
  constructor(ethereumProvider, ipfsGatewayURI = "https://gateway.ipfs.io") {
    this.arbitrator = new Arbitrator(ethereumProvider, ipfsGatewayURI);
    this.arbitrable = new Arbitrable(ethereumProvider, ipfsGatewayURI);
  }

  /**
   * Set the provider instance.
   * @param {object} provider - The provider object.
   */
  setProvider = (provider = isRequired("provider")) => {
    this.arbitrator.setProvider(provider);
    this.arbitrable.setProvider(provider);
  };

  /**
   * Set the IPFS gateway enviornemnt variable
   * @param {string} ipfsGatewayURI - The ipfs gateway URI.
   */
  setIpfsGateway = (ipfsGatewayURI = isRequired("ipfsGatewayURI")) => {
    // remove trailing '/'
    if (ipfsGatewayURI.lastIndexOf("/") === ipfsGatewayURI.length - 1)
      ipfsGatewayURI = ipfsGatewayURI.slice(
        0,
        Math.max(0, ipfsGatewayURI.length - 1)
      );

    this.arbitrator.setIpfsGateway(ipfsGatewayURI);
    this.arbitrable.setIpfsGateway(ipfsGatewayURI);
  };
}

export default Archon;