import { ethers } from "hardhat";

async function main() {
  const INT = await ethers.getContractFactory("INT");
  const intern = await INT.deploy(ethers.utils.parseEther("1000000"));

  await intern.deployed();

  console.log("Contract deployed!", intern.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
