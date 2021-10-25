import { ethers } from 'ethers';
import config from '../utils/contract_config.json';
import moment from 'moment';

const contractAddress = '0xa863a2C59937ca6E8FF733F462D69A2C2903D979';

const connection = async () => {
  const { ethereum: eth } = window;
  const { abi } = config;
  try {
    // A connection to the blockchain. Web3 interacts with the blockchain using the provider.
    const provider = new ethers.providers.Web3Provider(eth);
    // Account for signing the transaction. Can be used to sign messages and transactions
    const signer = provider.getSigner();

    // Connecting to the whole contract
    return new ethers.Contract(contractAddress, abi, signer);
  } catch (error) {
    return error;
  }
};

const eventListener = (contract) => {
  contract.on('NewBook', (from, timestamp, book) => {
    return {
      address: from,
      name: book,
      timestamp: moment(new Date(timestamp * 1000)).format(
        'MMMM Do YYYY, h:mm:ss a'
      ),
    };
  });
};

//setBookTotals(previousState => [...previousState, eventListenewr]);

export { connection, contractAddress, eventListener };
