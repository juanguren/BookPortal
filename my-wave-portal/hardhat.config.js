require('@nomiclabs/hardhat-waffle');
const dotenv = require('dotenv');

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const { ALCHEMY_KEY, METAMASK_KEY } = process.env;

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: ALCHEMY_KEY, // Alchemy PK
      accounts: [METAMASK_KEY], // Wallet PK(s)
    },
  },
};
