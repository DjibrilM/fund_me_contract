require("dotenv").config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";

const SPOLIA_PRIVATE_KEY = process.env.SPOLIA_PRIVATE_KEY;
const ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY;
const SPOLIA_RPC_URL = process.env.SPOLIA_RPC_URL;
const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY;

console.log(SPOLIA_RPC_URL);

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
      },
      {
        version: "0.8.0",
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    spolia: {
      url: SPOLIA_RPC_URL,
      accounts: [SPOLIA_PRIVATE_KEY || ""],
      chainId: 11155111,
    },
  },

  etherscan: {
    apiKey: ETHER_SCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
    outputFile: "gas-reporter.txt",
    noColors: true,
    token:'MATIC',
    currency: "USD",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
