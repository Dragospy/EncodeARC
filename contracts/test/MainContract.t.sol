
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MainContract.sol";
import "./MockUSDC.sol";

contract MainContractTest is Test {
    MainContract main;
    MockUSDC usdc;

    address owner = address(1);
    address keeper = address(2);
    address employer = address(3);
    address alice = address(4);
    address bob = address(5);

    function setUp() public {
        vm.startPrank(owner);

        usdc = new MockUSDC();

        main = new MainContract(
            address(usdc),
            owner,   // fee collector for tests
            100,     // 100 bps = 1%
            1e6      // min fee = 1 USDC 
        );

        main.setKeeper(keeper);

        vm.stopPrank();
    }

    function testP2PSend() public {
        // Mint USDC to employer
        usdc.mint(employer, 1000e6);

        // Employer approves contract
        vm.prank(employer);
        usdc.approve(address(main), type(uint256).max);

        // P2P send
        vm.prank(employer);
        main.send(alice, 200e6, "hello", false);

        assertEq(usdc.balanceOf(alice), 200e6);
    }

    function testP2PFee() public {
        usdc.mint(employer, 1000e6);
        vm.prank(employer);
        usdc.approve(address(main), type(uint256).max);

        vm.prank(employer);
        main.send(alice, 100e6, "test", false);

        // 1% fee = 1 USDC
        assertEq(usdc.balanceOf(owner), 1e6);
    }

    function testRevertWhenP2PPaused() public {
        vm.prank(owner);
        main.setPausedP2P(true);

        vm.prank(employer);
        vm.expectRevert("P2P paused");
        main.send(alice, 100e6, "", false);
    }

    function testCreatePayroll() public {
        vm.startPrank(employer);

        address[] memory emps = new address[](2);
        emps[0] = alice;
        emps[1] = bob;

        uint256[] memory amts = new uint256[](2);
        amts[0] = 100e6;
        amts[1] = 200e6;


        main.createPayroll(emps, amts, 7 days, false);

        vm.stopPrank();

        (
            address employer_,
            address[] memory employees,
            uint256[] memory amounts,
            uint40 interval,
            uint40 nextRun,
            bool active,
            bool privacy
        ) = main.getPayroll(0);

        // Assertions
        assertEq(employer_, employer);
        assertEq(employees.length, 2);
        assertEq(employees[0], alice);
        assertEq(employees[1], bob);
        assertEq(amounts[0], 100e6);
        assertEq(amounts[1], 200e6);
        assertEq(interval, 7 days);
        assertTrue(active);
    }
}