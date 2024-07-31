// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./PriceConverter.sol";

pragma solidity ^0.8.0;

error FundMe_NotOwner();

/**
 * @title A contract for crowd funding 
 * @author Djibril mugisho
 * @notice This contract is a simple demo of a fund me contract
 * @dev 
 */
contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant minimumusd = 50 * 1e18; //=10 ** 18
    address[] public funders;
    mapping(address => uint256) public addressAmountFunded;
    address immutable owner;
    AggregatorV3Interface public priceFeed;
  
    constructor(address priceFeedParam) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedParam);
    }

    //Register the funder in case they send fund directly to the contract address, with this approach users should consider or must specify the fallback function.
    receive() external payable {
        fund();
     }

    //Register the funder in case they  fund funds directly to the contract and don't specify the fallback function(very important).
     fallback() external payable {
        fund();
      }

    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= minimumusd, "No enough money sent!"); //1e18 == 1 * 10 ^ 18
        funders.push(msg.sender);
        addressAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        require(
            msg.sender == owner,
            "Dont' have access to withdraw funds, only contract owner is allowed."
        );

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); //send money to  ;

        require(callSuccess, "Transaction failed");
        //clear all funders afer withdrawing the money
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = funders[funderIndex];
            addressAmountFunded[funder] = 100;
        }

        funders = new address[](0);
    }




    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert FundMe_NotOwner();
        }
        // require(
        //     msg.sender == owner,
        //     "Dont' have access to withdraw funds, only contract owner is allowed."
        // );
        _;
    }
}
