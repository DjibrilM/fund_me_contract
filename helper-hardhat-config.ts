const networkConfig = {
  11155111: {
    name: "spolia",
    etherUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  137: {
    name: "Polygon",
    etherUsdPriceFeed: "0x72484B12719E23115761D5DA1646945632979bB6",
  },
};

export const developmentChains = ["hardhat", "localhost"];
export const DECIMALS = 8;
export const INITIAL_ANSWER = 301300000000;

export default networkConfig;