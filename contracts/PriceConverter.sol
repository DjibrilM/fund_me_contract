// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getConversionRate(uint256 ethAmount,AggregatorV3Interface priceFeed)
        internal 
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethAmount * ethPrice) / 1e18;
        return ethAmountInUsd;
    }

    function getPrice(AggregatorV3Interface priceFeed) internal  view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();

        return uint256(answer * 1e10); //eth amount * 1*10^10 =
    }

    function getVersion() internal view   returns (uint256) {
        AggregatorV3Interface priceFeedConsumerContract = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        return priceFeedConsumerContract.version();
    }
} 
