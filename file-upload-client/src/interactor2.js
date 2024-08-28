import React, { useState } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import WalletIcon from '@mui/icons-material/Wallet';
import { Button } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Input from '@mui/material/Input';
import PaidIcon from '@mui/icons-material/Paid';

const TokenTransfer = () => {
  const contractAddress = "0x87c6f0A0Ea928Bd5eA99dDE2355668Ba4340af57";

  const [recipient, setRecipient] = useState(contractAddress);
  const [amount, setAmount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [verified, setVerified] = useState("Not verified");
  const fingerprintHandler = async () => {
    try{
      let data = await axios.post('http://localhost:5001/verifyFinger',{"name" : localStorage.getItem('name')},{
        headers : {
          "Content-Type" : "application/json"
        }
      })

      setVerified(data.data.message)
    }
    catch(err)
    {
      console.log(err)
      
    }
  }

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

        await contract.methods.transfer(recipient).send({
          from: account,
          value: web3.utils.toWei(amount, 'ether')
        });
        alert("Transfer successful!");
      } catch (error) {
        console.error("Transfer failed", error);
      }
    }
    else{
      console.log("helo")
    }
  };

  return (
    <div style = {{ marginLeft : "100px" , marginTop : "25px"}}>
    <div style = {{display : "flex",alignItems : "center", justifyContent : "center",}}>
      <QrCodeScannerIcon />
      <h3>Sponsor</h3>
      </div>
      <Button startIcon = {<WalletIcon/>} onClick={initWeb3}>Connect Wallet</Button>

      <div style = {{display : "grid", marginTop : "20px" , gridAutoFlow : "column", columnGap : "5px"  }}>
      <div style = {{display : "grid" , rowGap : "7px"}}>
      <span >
      Recipient Address
      </span>
      <span >
      Amount (ETH)
      </span>
      

      <span >
      Finger verification
      </span>
      </div>
      
      <div style = {{display : "grid" , rowGap : "7px"}}>
       
          <Input type="text" value={contractAddress} onChange={(e) => setRecipient(e.target.value)} disabled />

          <Input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />

          <div>
        <Input type="text" value={verified} disabled />
        <Button onClick = {()=>fingerprintHandler()}> Verify </Button>
        </div>
      </div>
      </div>
      <Button startIcon = {<PaidIcon/>} style = {{marginTop : "10px"}} onClick={handleTransfer}>Transfer</Button>
    </div>
  );
};

export default TokenTransfer;
