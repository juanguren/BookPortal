const main = async () => {
  const [deployer] = await hre.ethers.getSigners(); // deployer: The node deploying the contract (me)

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log(
    `Account present balance: ${(await deployer.getBalance()).toString()}`
  );

  const Contract = await hre.ethers.getContractFactory('WavePortal'); // Calling our wave contract
  const contract = await Contract.deploy(); // Starts building local network for deploy
  await contract.deployed(); // Waits until deployoment

  console.log(`WavePortal address: ${contract.address}`); // Address of the deployed contract
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
