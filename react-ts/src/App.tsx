import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import INT from './artifacts/contracts/INT.json';

import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

const INTAddress = "0x0765f65C912b4D4f0895c581aa61E5cbAb56e722"

function App() {

  const [userAccount, setUserAccount] = useState('')
  const [owner, setOwner] = useState('')
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState()
  const [balance, setBalance] = useState() as any;
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState('');
  const [contract, setContract] = useState() as any;
  const [defaultAccount, setDefaultAccount] = useState(null);

  async function requestAccount() {
    accountChangedHandler(await (window as any).ethereum.request({method: 'eth_requestAccounts'}));
  }
  
  const accountChangedHandler = (newAccount: any) => {
    setDefaultAccount(newAccount);
    updateEthers();
  }


  const chainChangedHandler = () => {
    window.location.reload();
  }

  (window as any).ethereum.on('accountsChanged', accountChangedHandler);

  (window as any).ethereum.on('chainChanged', chainChangedHandler);

  const updateEthers = () => {
    let tempProvider: any = new ethers.providers.Web3Provider((window as any).ethereum);
    setProvider(tempProvider);

    let tempSigner: any = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract: any = new ethers.Contract(INTAddress, INT.abi, tempSigner);
    setContract(tempContract);  
  }

  useEffect(() => {
    if (contract != null) {
      getBalance();
      getWlStatus();
      getOwner();
    }
  }, [contract]);

async function getBalance() {
  if(typeof (window as any).ethereum !== 'undefined'){
    const [account] = await (window as any).ethereum.request({ method: 'eth_requestAccounts'})
    let _balance = await contract.balanceOf(account)
    const balDecimals = await contract.decimals();
    setBalance(_balance /= 10**balDecimals)
  }
}

async function getWlStatus() {
  if(typeof (window as any).ethereum !== 'undefined'){
    const [account] = await (window as any).ethereum.request({ method: 'eth_requestAccounts'})
    let _status = await contract.addressWhitelistStatus(account)
    setStatus(_status)
  }
}

async function getOwner(){
  if(typeof (window as any).ethereum !== 'undefined'){
    await (window as any).ethereum.request({ method: 'eth_requestAccounts'})
    let _owner = await contract.owner()
    setOwner(_owner)
  }
}

async function sendINT() {
  if(typeof (window as any).ethereum !== 'undefined'){
    if(amount > balance){
      swal("Error", "You don't have enought INT!", "error")
    }
    await requestAccount()
    const transaction = await contract.transfer(userAccount, ethers.utils.parseEther(amount as any))
    await transaction.wait()
    swal("Success", "INT tokens sent successfully!", "success")
  }
}

async function mintINT() {
  if(typeof (window as any).ethereum !== 'undefined'){
    if(!status){
      swal("Error", "You are not whitelisted!", "error")
    }
    await requestAccount()
    const transaction = await contract.mint(userAccount, ethers.utils.parseEther(amount as any))
    await transaction.wait()
    swal("Success", "INT tokens minted successfully!", "success")
  }
}

async function burnINT() {
  if(typeof (window as any).ethereum !== 'undefined'){
    if(!status){
      swal("Error", "You are not whitelisted!", "error")
    }
    else if(amount > balance){
      swal("Error", "You don't have enought INT to burn!", "error")
    }
    await requestAccount()
    const transaction = await contract.burn(userAccount, ethers.utils.parseEther(amount as any))
    await transaction.wait()
    swal("Success", "INT tokens burned successfully!", "success")
  }
}

async function addToWl() {
  if(typeof (window as any).ethereum !== 'undefined'){
    const userAccountStatus = await contract.addressWhitelistStatus(userAccount)
    if(!status){
      swal("Error","You are not whitelisted!", "error")
    }
    else if(userAccountStatus){
      swal("Error","Address is already whitelisted!", "error")
    }
    await requestAccount()
    const transaction = await contract.addToWhitelist(userAccount)
    await transaction.wait()
    swal("Success", "Added to the whitelist successfully!", "success")
  }
}

async function removeFromoWl() {
  if(typeof (window as any).ethereum !== 'undefined'){
    const userAccountStatus = await contract.addressWhitelistStatus(userAccount)
    if(!status){
      swal("Error","You are not whitelisted!", "error")
    }
    else if(userAccount.toLowerCase() === owner.toLowerCase()){
      swal("Error","Owner can't be removed!", "error")
    }
    else if(!userAccountStatus){
      swal("Error","Address is not whitelisted yet!", "error")
    }
    await requestAccount()
    const transaction = await contract.removeFromWhitelist(userAccount)
    await transaction.wait()
    swal("Success", "Removed from the whitelist successfully!", "success")
  }
}

function layer(a: any) {
    let l: any = getElementsByClass('layer', null, 'div');
    for (let i = 0; i < l.length; i++)l[i].style.display = (i === a ? 'block' : 'none');
    l = getElementsByClass('layer', null, 'span');
    for (let i = 0; i < l.length; i++) {
        l[i].className = (i === a ? 'layer act' : 'layer');
    }
}

function getElementsByClass(searchClass: any, node: any, tag: any) {
  let classElements = [];
  if (node === null) node = document;
  else if (typeof (node) != "object") node = document.getElementById(node); if (!node) return;
  if (tag === null) tag = '*';
  let els = node.getElementsByTagName(tag);
  let elsLen = els.length;
  let pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
  for (let i = 0, j = 0; i < elsLen; i++) {
      if (pattern.test(els[i].className)) {
          classElements[j] = els[i];
          j++;
      }
  }
  return classElements;
}

  return (
    <div className="App">
      <div className='rel header'>
        <img src={require("./img/INT.png")} alt="1" className="logo" />
        <button className="connect" onClick={requestAccount}>Connect wallet</button>
    </div>

      <div>
            <table className="info">
            <thead>
              <tr>
                <th style={{width:500}}>Address</th>
                <th>INT Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{defaultAccount}</td>
                <td>{balance}</td>
              </tr>
            </tbody>
          </table>
      </div>

      <div className="content">

        <span className="first layer act" onClick={() => layer(0)}>Send INT</span>
        <span className="layer " onClick={() => layer(1)}>Mint and Burn INT</span>
        <span className="last layer" onClick={() => layer(2)}>Whitelist</span>
     
      <div className="layer act">
      <table className='action'>
        <tbody>
          <tr>
            <td>Address:</td>
            <td>
              <input onChange={e => setUserAccount(e.target.value)} placeholder="Enter address"/>
            </td>
          </tr>
          <tr>
            <td>INT amount:</td>
            <td>
              <input onChange={e => setAmount((e as any).target.value)} placeholder="Enter amount"/>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button className='accept' onClick={sendINT}>Send INT</button>
            </td>
          </tr>
        </tbody>
      </table>
        </div>

      <div className="layer">
      <table className='action'>
        <tbody>
          <tr>
            <td>Address:</td>
            <td>
              <input onChange={e => setUserAccount(e.target.value)} placeholder="Enter address"/>
            </td>
          </tr>
          <tr>
            <td>INT amount:</td>
            <td>
              <input onChange={e => setAmount((e as any).target.value)} placeholder="Enter amount"/>
            </td>
          </tr>
          <tr>
            <td>
              <button className='accept' onClick={mintINT}>Mint INT</button>
            </td>
            <td>
              <button className='accept' onClick={burnINT}>Burn INT</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <div className="layer">
      <table className='action'>
        <tbody>
          <tr>
            <td>Address:</td>
            <td>
              <input onChange={e => setUserAccount(e.target.value)} placeholder="Enter address"/>
            </td>
          </tr>
          <tr>
            <td>
              <button className='accept' onClick={addToWl}>Add</button>
            </td>
            <td>
              <button className='accept' onClick={removeFromoWl}>Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>  
    </div>
  );
}

export default App;
