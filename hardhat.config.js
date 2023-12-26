
const key = require("./keys.json");

require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    myNetwork: {
      url: "http://localhost:8545",
      chainId: 1337,
      // localhost: {}
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [key.DEPLOY_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: key.POLYGON_API_KEY
  },
  solidity: "0.8.19",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }

};
