const testComplementMethods = async (contract, owner) => {
  // * Method 1
  let totalBooks = await contract.getTotalBookData();
  totalBooks.map((book) => {
    console.log({ title: book.book_name });
  });

  // * Method 2
  const totalOfBooks = await contract.getTotalBookCount();
  console.log({ totalOfBooks: totalOfBooks.toString() });

  // * Method 3
  const userBookCount = await contract.getBookCountPerUser(owner.address);
  console.log({ userBookCount: userBookCount.toString() });
};

module.exports = { testComplementMethods };
