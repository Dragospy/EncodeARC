pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MainContract{
    IERC20 public USDT; //usdt token
    address public feeCollection; //collecting our portion of the fees in this wallet

    address public owner; //contract owner
    address public keeper; //



    
}
