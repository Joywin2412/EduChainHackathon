import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
const TokenTransfer = ({walletAddress,id,change,setChange}) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  const contractAddress = walletAddress;
  const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

  // Initialize Web3
  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        console.log(accounts)
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error("Failed to load web3, accounts, or contract.", error);
      }
    }
  };

  // Handle the Transfer
  const handleTransfer = async () => {
    console.log(recipient)
    if (contract && web3) {
      try {
        console.log("Recipient Address:", recipient); // Log recipient to ensure it's correct
        console.log("Sender Address:", account); // Log sender to ensure it's correct
        console.log("Amount (ETH):", amount); // Log amount to ensure it's correct
        if(amount !== 0){
        await contract.methods.transfer(walletAddress).send({
          from: account,
          value: web3.utils.toWei(amount, 'ether')
        });
        }
        await axios.post("http://localhost:5000/pull-requests/close",{id} ,{
          headers: {
              "Content-Type": "application/json"
        }
        })
        setChange(!change)
        alert("Transfer successful!");
      } catch (error) {
        console.error("Transfer failed", error);
      }
    }
  };

  return (
    <div>
      <h2>Token Transfer</h2>
      <button onClick={initWeb3}>Connect Wallet</button>
      <div>
        <label>
          Recipient Address:
          <input type="text" value={walletAddress} disabled onChange={(e) => setRecipient(e.target.value)}  />
        </label>
      </div>
      <div>
        <label>
          Amount (ETH):
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default TokenTransfer;
