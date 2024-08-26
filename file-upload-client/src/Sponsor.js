import React from 'react';
import Web3 from 'web3';

const SponsorButton = () => {
    const web3 = new Web3(Web3.givenProvider);
    const contractAddress = "0x321024353368b9bf35b7931c2f02f4f44f95c6bc";
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_sponsorWallet",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newSponsorWallet",
                    "type": "address"
                }
            ],
            "name": "changeSponsorWallet",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "tokenAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "sponsor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sponsorWallet",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const sponsorWallet = "0x7d922e8d5494029d1d47974d82d25be410d6fb89";
    const tokenAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

    const sponsor = async () => {
        const accounts = await web3.eth.requestAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const amount = web3.utils.toWei("0.0001", "edu");  // Adjust amount as needed

        try {
            await contract.methods.sponsor(tokenAddress, amount).send({ from: accounts[0] });
            alert("Sponsorship successful!");
        } catch (error) {
            console.error(error);
            alert("Sponsorship failed.");
        }
    };

    return (
        <button onClick={sponsor}>
            Sponsor
        </button>
    );
};

export default SponsorButton;
