import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import networkConfig, { developmentChains } from "../helper-hardhat-config";
type ChainId = keyof typeof networkConfig;

module.exports = async function deployFunc({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId as ChainId;

  let etherUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const aggregatorV3ContractAddress = (
      await deployments.get("MockV3Aggregator")
    ).address;
    etherUsdPriceFeedAddress = aggregatorV3ContractAddress;
  } else {
    etherUsdPriceFeedAddress = networkConfig[chainId].etherUsdPriceFeed;
  }

  //   deploy the 'fund me contract'
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [etherUsdPriceFeedAddress],
  });

  console.log("Fund me contract deployed...................");
  console.log("----------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
