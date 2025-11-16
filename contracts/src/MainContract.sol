pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
using SafeERC20 for IERC20;


contract MainContract is ReentrancyGuard {
    IERC20 public USDC; //usdc token
    address public feeCollection; //collecting our portion of the fees in this wallet

    uint16 public feeBps; //  fee rate in % basis points
    uint96 public minFee; //minumum fee so people dont send small amounts of money for nothing

    address public owner; //contract owner
    address public keeper; //adderss of bot for payroll services


    //safety cgec
    bool public pausedP2P;
    bool public pausedPayroll;
    uint256 public nextScheduleId;

    uint256 public totalTransfers; //shows total for fun

    uint256 public totalPayrollRuns;

    bool public privacyEnabled;
    mapping(uint256 => bool) public schedulePrivacy;
    mapping(bytes32 => bytes32) public privateHashes;
    mapping(address => bool) public denylisted;
    mapping(address => uint256[]) public employerSchedules;



    //memohash stores a hased version of the message on chain, which can be used to query the actual memo, saves gas
    event P2PTransfer(
        address indexed from,
        address indexed to,
        uint256 amount,         
        uint256 fee,            
        bytes32 memoHash,          
        bool privacy            
    );


    struct PayrollSchedule {
        address employer;
        address[] employees;
        uint256[] amounts;
        uint40 interval;
        uint40 nextRun;
        bool active;
        bool privacy;
    }

    mapping(uint256 => PayrollSchedule) public schedules;

    event PayrollCreated(
        uint256 indexed id,
        address indexed employer,
        uint40 interval,
        bool privacy
    );

    event PayrollRun(
        uint256 indexed id,
        uint256 totalPaid,
        uint256 fee,
        uint256 employeeCount
    );


    event PayrollCancelled(uint256 indexed id, address indexed employer);

    event EmployeeAdded(uint256 indexed id, address employee, uint256 amount);
    event EmployeeRemoved(uint256 indexed id, address employee);
    event SalaryUpdated(uint256 indexed id, address employee, uint256 oldAmount, uint256 newAmount);



    constructor(
        address _usdc, 
        address _feeCollection, 
        uint16 _feeBps, 
        uint96 _minFee
    ) {
        USDC = IERC20(_usdc);
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

    modifier onlyOwnerOrEmployer(uint256 id) {
    require(
        msg.sender == owner || msg.sender == schedules[id].employer,
        "not authorized"
        );
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


    function send(
        address to,
        uint256 amount,
        string calldata memo,
        bool requestPrivacy
    )
    external
    nonReentrant
    {
        require(!pausedP2P, "P2P paused");
        require(to != address(0), "invalid recipient");
        require(amount > 0, "amount=0");

        require(!denylisted[msg.sender], "sender denylisted");
        require(!denylisted[to], "recipient denylisted");

        (uint256 fee, uint256 totalFromSender, ) = quoteP2P(amount);

        USDC.safeTransferFrom(msg.sender, address(this), totalFromSender);

        USDC.safeTransfer(to, amount);

        USDC.safeTransfer(feeCollection, fee);
        

        totalTransfers += 1;

        bool privacy = privacyEnabled || requestPrivacy;

        bytes32 memoHash = bytes(memo).length == 0
            ? bytes32(0)
            : keccak256(abi.encodePacked(memo));

        emit P2PTransfer(
            msg.sender,
            to,
            amount,
            fee,
            memoHash,
            privacy
        );
    }

    function getPayroll(uint256 id)
        external
        view
        returns (
            address employer,
            address[] memory employees,
            uint256[] memory amounts,
            uint40 interval,
            uint40 nextRun,
            bool active,
            bool privacy
        )
    {
        PayrollSchedule storage s = schedules[id];
        return (
            s.employer,
            s.employees,
            s.amounts,
            s.interval,
            s.nextRun,
            s.active,
            s.privacy
        );

        
    }

    function getEmployees(uint256 id)
        external
        view
        returns (address[] memory employees, uint256[] memory amounts)
    {
        PayrollSchedule storage s = schedules[id];
        return (s.employees, s.amounts);
    }

    function getEmployerSchedules(address employer)
        external
        view
        returns (uint256[] memory)
    {
        return employerSchedules[employer];
    }   
   

    function addEmployee(uint256 id, address employee, uint256 amount)
        external onlyOwnerOrEmployer(id)
    {
        require(employee != address(0), "invalid employee");
        PayrollSchedule storage s = schedules[id];

        require(s.active, "inactive");

        s.employees.push(employee);
        s.amounts.push(amount);
    }

    function cancelPayroll(uint256 id)
        external
        onlyOwnerOrEmployer(id)
    {
        PayrollSchedule storage s = schedules[id];
        require(s.active, "already inactive");

        s.active = false;

        emit PayrollCancelled(id, s.employer);
    }   


    function removeEmployee(uint256 id, uint256 index)
        external
        onlyOwnerOrEmployer(id)
    {
        PayrollSchedule storage s = schedules[id];
        require(index < s.employees.length, "bad index");

        uint256 last = s.employees.length - 1;

        // swap with last element
        s.employees[index] = s.employees[last];
        s.amounts[index] = s.amounts[last];

        // remove last
        s.employees.pop();
        s.amounts.pop();
    }

    function quoteTransfer(uint256 amount)
        public
        view
        returns (uint256 fee, uint256 totalFromSender, uint256 amountToRecipient)
    {
        require(amount > 0, "amount=0");

        // percentage fee in bps
        uint256 pct = (amount * feeBps) / 10_000;
        fee = pct < minFee ? minFee : pct;

        totalFromSender = amount + fee;   // what sender must have approved
        amountToRecipient = amount;       // net delivered
    }


    function updateSalary(uint256 id, uint256 index, uint256 newAmount)
    external
    onlyOwnerOrEmployer(id)
    {
        PayrollSchedule storage s = schedules[id];
        require(s.active, "inactive schedule");
        require(index < s.employees.length, "bad index");
        require(newAmount > 0, "invalid salary");

        uint256 old = s.amounts[index];
        s.amounts[index] = newAmount;

        emit SalaryUpdated(id, s.employees[index], old, newAmount);
    }


    function createPayroll(
        address[] calldata employees,
        uint256[] calldata amounts,
        uint40 interval,
        bool privacy
    )
    external
    {
        require(employees.length > 0, "no employees");
        require(employees.length == amounts.length, "length mismatch");
        require(interval > 0, "invalid interval");

        // Create ID
        uint256 id = nextScheduleId++;
        PayrollSchedule storage s = schedules[id];
        employerSchedules[msg.sender].push(id);


        // Store metadata
        s.employer = msg.sender;
        s.interval = interval;
        s.nextRun = uint40(block.timestamp + interval);
        s.active = true;
        s.privacy = privacy;

        // Copy arrays
        for (uint256 i = 0; i < employees.length; i++) {
            require(employees[i] != address(0), "invalid employee");
            s.employees.push(employees[i]);
            s.amounts.push(amounts[i]);
        }

        emit PayrollCreated(id, msg.sender, interval, privacy);
    }



    function runPayroll(uint256 id)
        external
        onlyKeeper
        nonReentrant
    {
        PayrollSchedule storage s = schedules[id];

        require(s.active, "inactive");
        require(!pausedPayroll, "payroll paused");
        require(block.timestamp >= s.nextRun, "too early");

        uint256 employeeCount = s.employees.length;
        require(employeeCount > 0, "no employees");

        uint256 totalToEmployees = 0;
        for (uint256 i = 0; i < employeeCount; i++) {
            totalToEmployees += s.amounts[i];
        }

        (uint256 fee, uint256 totalFromEmployer, ) = quoteP2P(totalToEmployees);

        USDC.safeTransferFrom(s.employer, address(this), totalFromEmployer);

        for (uint256 i = 0; i < employeeCount; i++) {
            USDC.safeTransfer(s.employees[i], s.amounts[i]);
        }

        USDC.safeTransfer(feeCollection, fee);

        totalPayrollRuns++;

        s.nextRun = uint40(block.timestamp + s.interval);

        emit PayrollRun(id, totalToEmployees, fee, employeeCount);
    }
    

}
