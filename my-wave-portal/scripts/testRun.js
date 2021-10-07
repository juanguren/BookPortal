const main = async () => {
  const [owner, randomPerson] = await ethers.getSigners();

  const testContractMain = await hre.ethers.getContractFactory('TestContract');
  const testContract = await testContractMain.deploy();
  await testContract.deployed();

  const instructor = await testContract.setInstructor(
    owner.address,
    10,
    'HEY',
    'YOU'
  );
  await instructor.wait();

  const getData = await testContract.getInstructor(owner.address);
  console.log({ getData });
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
