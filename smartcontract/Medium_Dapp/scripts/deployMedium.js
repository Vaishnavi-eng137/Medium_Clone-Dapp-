
const hre = require("hardhat");

async function main() {
 
  const Medium = await hre.ethers.getContractFactory("Medium");
  const medium = await Medium.deploy(
    "Medium Blog",
    "BLOG",
    "1000000000000000000" //1 MATIC
  );

  await medium.deployed();

  console.log("Medium deployed to:", medium.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
