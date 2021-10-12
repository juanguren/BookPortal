const testComplementMethods = async (contract, owner) => {
  try {
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
  } catch (error) {
    return { error };
  }
};

const checkForBalance = async (contract) => {
  try {
    const foundBalance = await Headers.ethers.provider.getBalance(
      contract.address
    );
    return {
      balance: hre.ethers.utils.formatEther(foundBalance),
    };
  } catch (error) {
    return error;
  }
};

module.exports = { testComplementMethods, checkForBalance };
