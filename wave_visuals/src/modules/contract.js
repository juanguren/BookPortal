import { ethers } from 'ethers';
import config from '../utils/contract_config.json';

const contractAddress = '0x7AD915106DEAD8F67748FA66060e39793DBBdA9a';

const connection = async () => {
  const { ethereum: eth } = window;
  const { abi } = config;
  try {
    // A connection to the blockchain. Web3 interacts with the blockchain using the provider.
    const provider = new ethers.providers.Web3Provider(eth);
    // Account for signing the transaction. Can be used to sign messages and transactions
    const signer = provider.getSigner();
    // Connecting to our whole contract
    return new ethers.Contract(contractAddress, abi, signer);
  } catch (error) {
    return error;
  }
};

export { connection, contractAddress };
