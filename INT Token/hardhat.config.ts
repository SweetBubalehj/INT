import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat :{},
    ropsten: {
      url: "",
      accounts: [""]
    }
  },
  etherscan:{
    apiKey: "NPI2UWCE5AFWNJ8NJRCW2HQUWK2SM578CH"
  }
};

export default config;
