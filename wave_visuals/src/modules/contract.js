import { ethers } from 'ethers';
import bookPortal from '../utils/bookPortal.json';

const contractAddress = '0xa66a3916bCAB115296b1Ec56635d9c646dcc9A07';

const connection = async (address) => {
  const { ethereum: eth } = window;
  const { abi } = bookPortal;
  try {
    // A connection to the blockchain. Web3 interacts with the blockchain using the provider.
    const provider = new ethers.providers.Web3Provider(eth);
    // Account for signing the transaction. Can be used to sign messages and transactions
    const signer = provider.getSigner();
    // Connecting to our whole contract
    return new ethers.Contract(address, abi, signer);
  } catch (error) {
    return error;
  }
};

export { connection, contractAddress };
