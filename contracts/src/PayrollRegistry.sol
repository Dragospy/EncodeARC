// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/**
 * @title PayrollRegistry
 * @notice Factory contract for creating payroll vaults
 * @dev TODO: Implement vault creation logic
 */
contract PayrollRegistry is AccessControl {
    using Clones for address;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Implementation contract for vault clones
    address public immutable vaultImplementation;

    event VaultCreated(address indexed employer, address indexed vault);

    constructor(address _vaultImplementation) {
        vaultImplementation = _vaultImplementation;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Create a new vault for the caller
     * @dev TODO: Implement vault creation
     */
    function createVault() external returns (address vault) {
        // TODO: Implement vault creation logic
        revert("Not implemented");
    }
}

