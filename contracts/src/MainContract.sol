pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;

contract MainContract is ReentrancyGuard {
    IERC20 public USDT; //usdt token
    address public feeCollection; //collecting our portion of the fees in this wallet

    uint16 public feeBps; //  fee rate in % basis points
    uint96 public minFee; //minumum fee so people dont send small amounts of money for nothing

    address public owner; //contract owner
    address public keeper; //adderss of bot for payroll services


    //safetey
    bool public pausedP2P;
    bool public pausedPayroll;
    uint256 public nextScheduleId;

    uint256 public totalTransfers; //shows total for fun

    uint256 public totalPayrollRuns;

    bool public privacyEnabled;
    mapping(uint256 => bool) public schedulePrivacy;
    mapping(bytes32 => bytes32) public privateHashes;
    mapping(address => bool) public denylisted;


    //memohash stores a hased version of the message on chain, which can be used to query the actual memo, saves gas
    event P2PTransfer(
        address indexed from,
        address indexed to,
        uint256 amount,         
        uint256 fee,            
        bytes32 memoHash,          
        bool privacy            
    );



    constructor(address _usdt, address _feeCollection, uint16 _feeBps, uint96 _minFee) {
        USDT = IERC20(_usdt);
        feeCollection = _feeCollection;
        feeBps = _feeBps;
        minFee = _minFee;
        owner = msg.sender;
    }

    
    modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
    }

    modifier onlyKeeper() {
    require(msg.sender == keeper, "Not keeper");
    _;
    }

    function setFees(uint16 _feeBps, uint96 _minFee) external onlyOwner {
        feeBps = _feeBps;
        minFee = _minFee;
    }

    function setFeeCollector(address _collector) external onlyOwner {
        feeCollection = _collector;
    }

    function setKeeper(address _keeper) external onlyOwner {
        keeper = _keeper;
    }

    function setPausedP2P(bool _paused) external onlyOwner {
        pausedP2P = _paused;
    }

    function setPausedPayroll(bool _paused) external onlyOwner {
        pausedPayroll = _paused;
    }

    function togglePrivacy(bool _enabled) external onlyOwner {
        privacyEnabled = _enabled;
    }   

    function setDenylist(address _user, bool _status) external onlyOwner {
        denylisted[_user] = _status;
    }

    function quoteP2P(uint256 amount)
    public
    view
    returns (uint256 fee, uint256 totalFromSender, uint256 amountToRecipient){
        require(amount > 0, "amount=0");

        // percentage fee in bps
        uint256 pct = (amount * feeBps) / 10_000;
        fee = pct < minFee ? minFee : pct;

        totalFromSender = amount + fee;   // what sender must have approved
        amountToRecipient = amount;       // net delivered
    }

}
