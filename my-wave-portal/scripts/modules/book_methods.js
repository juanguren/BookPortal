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
    const ethBalance = await hre.ethers.provider.getBalance(contract.address);
    const weiBalance = await contract.getBalance();
    return {
      eth: hre.ethers.utils.formatEther(ethBalance),
      wei: weiBalance.toString(),
    };
  } catch (error) {
    return error;
  }
};

module.exports = { testComplementMethods, checkForBalance };
