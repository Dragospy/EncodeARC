// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PayrollRegistry} from "../src/PayrollRegistry.sol";
import {EmployerVault} from "../src/EmployerVault.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy implementation
        EmployerVault implementation = new EmployerVault();
        console.log("Implementation:", address(implementation));

        // Deploy registry
        PayrollRegistry registry = new PayrollRegistry(address(implementation));
        console.log("Registry:", address(registry));

        vm.stopBroadcast();
    }
}

