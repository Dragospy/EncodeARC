// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/MainContract.sol";
import "forge-std/Script.sol";

contract Deploy is Script {

    function run() external {
        // Load env vars
        address usdc = vm.envAddress("USDC_ADDRESS");
        address feeCollector = vm.envAddress("FEE_COLLECTOR");

        uint16 feeBps = uint16(vm.envUint("FEE_BPS"));
        uint96 minFee = uint96(vm.envUint("MIN_FEE"));

        vm.startBroadcast();

        MainContract main = new MainContract(
            usdc,
            feeCollector,
            feeBps,
            minFee
        );

        vm.stopBroadcast();

        console.log("MainContract deployed at:", address(main));
    }
}

