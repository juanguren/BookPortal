//const { ethers } = require("hardhat");

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); // Gets the contract's code
  const waveContract = await waveContractFactory.deploy(); // Starts building local network for deploy

  await waveContract.deployed(); // Waits until deployment

  //console.log(`Contract deployed to: ${waveContract.address}`); // Contract address
  //console.log(`Contract deployed by ${owner.address}`); // Owner's address

  let waveCount = await waveContract.getTotalWaves(); // Calling the totalWaves to get ammount

  let waveIncrement = await waveContract.wave(); // Call the wave method in order to increment wave count
  await waveIncrement.wait(); // wait until the transaction is mined (a state variable is being changed)

  waveCount = await waveContract.getTotalWaves(); // Call it again to check the increment

  // The wave contract is connected to the random user and a wave() operation is concatenated to it.
  waveIncrement = await waveContract.connect(randomPerson).wave();
  await waveContract.connect(randomPerson).wave();
  await waveIncrement.wait(); // Again, we wait for the transaction

  waveCount = await waveContract.getTotalWaves();

  let getUsers = await waveContract.getPastUsers();
  console.log(`Number of users: ${getUsers}`);

  await checkNumberOfWaves(waveContract, randomPerson.address);
};

const checkNumberOfWaves = async (Contract, address) => {
  let wavePerUser = await Contract.getWavesPerUser(address);
  console.log({
    userWaveCount: {
      address,
      waveCount: wavePerUser.toString(),
    },
  });
};

/**
 * Why do we do a waveTxn.wait(); though? What are we waiting for?
 * When calling “wave()” an object is returned with information about the request such as:
 *   sender, receiver, hash, blockHash, fee etc and the response of the request which is a Promise,
 *  I think the reason that we have to wait for this promise is that we don’t know when the
 *  computation will be executed by the miners

Why didn’t we do a .wait() after we read the total number of waves?
The reason we don’t have to wait after reading the total number of waves is that we are reading a value which doesn’t require computation executed by miners
 */

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
