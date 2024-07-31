import { describe } from "mocha";
import { FundMe } from "../typechain-types";
import { it } from "mocha";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { assert } from "chai";
import { Address } from "hardhat-deploy/dist/types";
import { expect } from "chai";

describe("FundMe", async () => {
  let fundMe: FundMe;
  let deployer: Address;
  let V3Aggregator: Address;
  const sendValue = ethers.parseEther("1");

  beforeEach(async () => {
    const { fixture } = deployments;
    deployer = (await getNamedAccounts()).deployer;
    await fixture(["all"]);
    fundMe = await ethers.getContractAt(
      "FundMe",
      (
        await deployments.get("FundMe")
      ).address
    );

    V3Aggregator = (await deployments.get("MockV3Aggregator")).address;
  });

  describe("constructor", async () => {
    it("sets the aggregator address correctly", async function () {
      const response = await fundMe.priceFeed();
      assert.equal(response, V3Aggregator);
    });
  });

  describe("fund", async () => {
    it("Fails if you don't send enought ether", async () => {
      await expect(fundMe.fund()).to.be.revertedWith("No enough money sent!");
    });

    it("update the amount founded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressAmountFunded(deployer);
      assert.equal(response, sendValue);
    });

    it("Add funder to the funders array", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.funders(0);
      assert.equal(funder, deployer);
    });
  });

  describe("withdraw", async () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue });
    });

    it("Make sure that deployer is able to withdraw all the funds", async () => {
      const deployerBalance = await ethers.provider.getBalance(deployer);
      const fundMeContractBalance = await ethers.provider.getBalance(
        await fundMe.getAddress()
      ); //=> arrang

      const TransactionResponse = await fundMe.withdraw(); //=> act
      const transacationawaitReceip = await TransactionResponse.wait(1);

      const gasUsed = transacationawaitReceip?.gasUsed;
      const effectiveGasPrice = transacationawaitReceip?.gasPrice;

      const totalGasPrice = gasUsed! * effectiveGasPrice!;

      const endingFundMeBalance = await ethers.provider.getBalance(
        await fundMe.getAddress()
      );
      const endingDeployerBalance = await ethers.provider.getBalance(deployer);

      assert.equal(endingFundMeBalance, BigInt(0)); //expect the contract balance to be zero after withdraw.
      assert.equal(
        deployerBalance + fundMeContractBalance,
        endingDeployerBalance + totalGasPrice
      );
    }); //check if the deployer received the balance of the contract

    it("Only allow the deployer(owner) to withdraw the contract's funds", async () => {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];
      const attackerConnectedContract = await fundMe.connect(attacker);
      await expect(attackerConnectedContract.withdraw()).to.reverted
    });
  });
});
