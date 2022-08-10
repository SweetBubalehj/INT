// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IERC20 {

    // OPTIONAL
    function name() external view returns(string memory);

    function symbol() external view returns (string memory);

    function mint(address to, uint amount) external;

    function burn(address to, uint amount) external;

    function addToWhitelist(address user) external;

    function removeFromWhitelist(address user) external;

    // function destroyContract() external;
    
    // STANDART
    function totalSupply() external view returns(uint);
    
    function decimals() external pure returns (uint);

    function balanceOf(address account) external view returns(uint);

    function transfer(address to, uint amount) external;

    function allowance(address _owner, address spender) external view returns(uint);

    function approve(address spender, uint amount) external;

    function transferFrom(address sender, address recipient, uint amount) external;

    // STANDART EVENTS
    // indexed - for a search (up to 3 in an event)
    event Transfer(address indexed from, address indexed to, uint amount);

    event Approve(address indexed owner, address indexed to, uint amount);

    // OPTIONALS EVENTS
    /* Whitelist
       bool status = true -> added to whitelist
       bool status = false -> removed from whitelist */
    event Whitelist(address indexed from, address indexed user, bool indexed status);

    /* TotalTokenStatus
       bool status = true -> minted
       bool status = false -> burned */
    event TotalTokenStatus(address indexed from, address indexed to, uint amount, bool indexed status);
}