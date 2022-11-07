import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat :{},
    ropsten: {
      url: "https://ropsten.infura.io/v3/f24912927a1d412da7349062f209feff",
      accounts: [""]
    }
  },
  etherscan:{
    apiKey: "NPI2UWCE5AFWNJ8NJRCW2HQUWK2SM578CH"
  }
};

export default config;
