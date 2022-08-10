import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat :{},
    ropsten: {
      url: "https://ropsten.infura.io/v3/f24912927a1d412da7349062f209feff",
      accounts: ["0xd8e2feaeee447868f3bda6a643dee113c467c22833ea10d05166b763767aa430"]
    }
  },
  etherscan:{
    apiKey: "NPI2UWCE5AFWNJ8NJRCW2HQUWK2SM578CH"
  }
};

export default config;
