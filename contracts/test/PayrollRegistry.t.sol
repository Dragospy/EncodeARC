// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {PayrollRegistry} from "../src/PayrollRegistry.sol";
import {EmployerVault} from "../src/EmployerVault.sol";

contract PayrollRegistryTest is Test {
    PayrollRegistry public registry;
    EmployerVault public vaultImplementation;

    function setUp() public {
        vaultImplementation = new EmployerVault();
        registry = new PayrollRegistry(address(vaultImplementation));
    }

    function test_RegistryDeployment() public {
        assertEq(address(registry.vaultImplementation()), address(vaultImplementation));
    }

    // TODO: Add more tests
}

