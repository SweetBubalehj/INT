// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./IERC20.sol";

contract ERC20 is IERC20 {
    uint totalTokens;

    address public owner;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;
    mapping(address => bool) whitelist;

    string _name;
    string _symbol;

    // MODIFIERS
    modifier enoughtTokens(address _from, uint _amount) {
        require(balanceOf(_from) >= _amount, "not enough tokens!");
        _;
    }

    modifier onlyWhitelisted(address _from) {
        require(whitelist[_from], "you are not whitelisted!");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not an owner!");
        _;
    }

    // CONSTRUCTOR
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        whitelist[owner] = true;
        emit Whitelist(msg.sender, msg.sender, whitelist[msg.sender]);
    }

    // OPTIONAL FUNCTIONS
    function name() external view returns(string memory){
        return _name;
    }

    function symbol() external view returns (string memory){
        return _symbol;
    }

    function mint(address to, uint amount) public onlyWhitelisted(msg.sender) {
        balances[to] += amount;
        totalTokens += amount;
        emit TotalTokenStatus(msg.sender, to, amount, true);
    }

    function burn(address to, 
            uint amount) 
            public onlyWhitelisted(msg.sender) 
            enoughtTokens(to, amount) {
        balances[to] -= amount;
        totalTokens -= amount;
        emit TotalTokenStatus(msg.sender, to, amount, false);
    }

    function addToWhitelist(address to) public onlyWhitelisted(msg.sender){
        require(!whitelist[to], "address is already whitelisted!");
        whitelist[to] = true;
        emit Whitelist(msg.sender, to, whitelist[to]);
    }
    
    function removeFromWhitelist(address to) public onlyWhitelisted(msg.sender){
        require(whitelist[to], "address is not whitelisted yet!");
        require(to != owner, "owner can't be deleted!");
        // burn(balanceOf(to), to); // burning balance after removing
        whitelist[to] = false;
        emit Whitelist(msg.sender, to, whitelist[to]);
    }

    function addressWhitelistStatus(address account) public view returns(bool) {
        return whitelist[account];
    }

    // STANDART FUNCTIONS
    function totalSupply() external view returns(uint) {
        return totalTokens;
    }

    function decimals() external pure returns(uint){
        return 18; // 1 token = 1 wei
    }
    
    function balanceOf(address account) public view returns(uint) {
        return balances[account];
    }

    function transfer(address to, uint amount) external enoughtTokens(msg.sender, amount) {
        _beforeTokenTransfer(msg.sender, to, amount);
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function allowance(address _owner, address spender) public view returns(uint){
        return allowances[_owner][spender];
    }

    function approve(address spender, uint amount) external {
        _approve(spender, msg.sender, amount);
    }

    function _approve(address spender, address _owner, uint amount) internal virtual {
        allowances[_owner][spender] = amount;
        emit Approve(_owner, spender, amount);
    }

    function transferFrom(address from, address _to, uint amount) public enoughtTokens(from, amount) {
        _beforeTokenTransfer(from, _to, amount);
        require(allowances[from][_to] >= amount, "check allowance!");
        allowances[from][_to] -= amount; // error!

        balances[from] -= amount;
        balances[_to] += amount;

        emit Transfer(from, _to, amount);
    }

    // openzeppelin feature (now emply)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint amount
    ) internal virtual{}
    
    // function destroyContract() public onlyOwner{
    //     address payable addr = payable(owner);
    //     selfdestruct(addr);
    // }
}
