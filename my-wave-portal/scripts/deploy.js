const main = async () => {
  const [deployer] = await hre.ethers.getSigners(); // deployer: The node deploying the contract (me)

  console.log(`Deploying contracts with the account: ${deployer.address}`);
  console.log(
    `Account present balance: ${(await deployer.getBalance()).toString()}`
  );

  const Contract = await hre.ethers.getContractFactory('BookPortal');
  const contract = await Contract.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  }); // funded
  await contract.deployed(); // Waits until deployment

  console.log(`BookPortal address: ${contract.address}`); // Address of the deployed contract
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
