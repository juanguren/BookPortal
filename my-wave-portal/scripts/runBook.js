const main = async () => {
  const bookContractFactory = await hre.ethers.getContractFactory('BookPortal');
  const bookContract = await bookContractFactory.deploy();
  await bookContract.deployed();

  let shareBookTxn = await bookContract.shareBook('Ficciones');
  await shareBookTxn.wait();

  let shareBook2 = await bookContract.shareBook('Wohoo');
  await shareBook2.wait();

  const [owner, randomPerson] = await ethers.getSigners();
  let randomBook = await bookContract
    .connect(randomPerson)
    .shareBook('La Ciudad de las Bestias');
  randomBook.wait();

  // * Method 1
  let totalBooks = await bookContract.getTotalBookData();
  totalBooks.map((book) => {
    console.log({ title: book.book_name });
  });

  // * Method 2
  const totalOfBooks = await bookContract.getTotalBookCount();
  console.log({ totalOfBooks: totalOfBooks.toString() });

  // * Method 3
  const userBookCount = await bookContract.getBookCountPerUser(owner.address);
  console.log({ userBookCount: userBookCount.toString() });
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
