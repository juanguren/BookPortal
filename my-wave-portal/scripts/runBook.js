const {
  testComplementMethods,
  checkForBalance,
} = require('./modules/book_methods');

const main = async () => {
  const bookContractFactory = await hre.ethers.getContractFactory('BookPortal');
  // Funding the contract with a parsed ammount (in ether)
  const bookContract = await bookContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await bookContract.deployed(); // promise

  // This method asks the contract for its balance
  console.log(await checkForBalance(bookContract));

  let shareBookTxn = await bookContract.shareBook('Ficciones');
  await shareBookTxn.wait();

  let shareBook2 = await bookContract.shareBook('Wohoo');
  await shareBook2.wait();

  const [owner, randomPerson] = await ethers.getSigners();
  let randomBook = await bookContract
    .connect(randomPerson)
    .shareBook('La Ciudad de las Bestias');
  randomBook.wait();

  await testComplementMethods(bookContract, owner);

  console.log(await checkForBalance(bookContract)); // Check again to get the change
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
