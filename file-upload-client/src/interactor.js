import React, { useEffect, useState } from 'react';
import lottery from './lottery';
import Web3 from 'web3';
const web3 = new Web3();
export const Button = () => {
    console.log(lottery)
    const [manager, setManager] = useState('');
    const [players, setPlayers] = useState([]);
    const [contractBalance, setContractBalance] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');
  
     useEffect(() => {
      const init = async () => {
        // const manager = await lottery._methods.owner()
        // const players = await lottery._methods.owner()
        // const balance = await web3.eth.getBalance(lottery.options.address);
        
        await window.ethereum.request({ method: "eth_requestAccounts"}) //open metamask
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const address = (accounts[0]);
        const balance = await web3.eth.getBalance(address)
        console.log(Number(balance)/Number(1000000000000000000))
        setContractBalance(balance);
        console.log(balance)
      };
      init();
    }, []);
    const sponsorHandler = async() => {
        const accounts = await web3.eth.getAccounts();
        const amountInWei = web3.utils.toWei('0.00001', 'ether');
        const send = await lottery._methods.transfer('0x87c6f0A0Ea928Bd5eA99dDE2355668Ba4340af57',amountInWei)
       
    }
    return (
        <div>
          <h2>Available Balance</h2>
          <p>
            Your balance is {web3.utils.fromWei(contractBalance, 'ether')} ether!
          </p>
          <hr />
          <button onClick = {sponsorHandler}> Sponsor</button>
         
        </div>
      );
}