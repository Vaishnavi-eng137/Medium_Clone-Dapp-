require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv");

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.11",
  networks:{
    mumbai:{
      url: process.env.MUMBAI_ALCHEMY_API,         // from alchemy http 
      accounts:[process.env.PRIVATE_KEY_MUMBAI]  // from the metamask wallet
    },
  },
  etherscan:{
    apiKey: process.env.API_KEY,  //get the api from polygonscan
  }
};
