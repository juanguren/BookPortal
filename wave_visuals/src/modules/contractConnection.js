import { ethers } from 'ethers';

const connectContract = async (eth_object, address, abi) => {
  // A connection to the blockchain. Web3 interacts with the blockchain using the provider.
  const provider = new ethers.providers.Web3Provider(eth_object);
  // Account for signing the transaction. Can be used to sign messages and transactions
  const signer = provider.getSigner();
  // Connecting to our whole contract
  return new ethers.Contract(address, abi, signer);
};

export default connectContract;
