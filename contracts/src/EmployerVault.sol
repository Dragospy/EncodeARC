// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title EmployerVault
 * @notice Manages payroll for employees
 * @dev TODO: Implement employee management and payout logic
 */
contract EmployerVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Whether the vault has been initialized
    bool private initialized;

    constructor() {
        // Implementation contract should not be initialized
    }

    /**
     * @notice Initialize the vault
     * @dev TODO: Implement initialization logic
     */
    function initialize(address admin) external {
        require(!initialized, "Already initialized");
        initialized = true;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    /**
     * @notice Add an employee
     * @dev TODO: Implement employee addition
     */
    function addEmployee() external onlyRole(ADMIN_ROLE) {
        // TODO: Implement
        revert("Not implemented");
    }
}

