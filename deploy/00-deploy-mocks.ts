import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

module.exports = async function deployFunc({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  if (developmentChains.includes(networkName)) {
    await deploy("MockV3Aggregator", {
      args: [DECIMALS, INITIAL_ANSWER],
      from: deployer,
    });

    console.log("MocAggregatorV3 Deployed");
    console.log(
      "--------------------------------------------------------------------------"
    );
  }
};

module.exports.tags = ["all", "mocks"];
