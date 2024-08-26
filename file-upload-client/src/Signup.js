import React, { useState } from 'react';
import Web3 from 'web3';

export default function Signup() {
  const [name, setName] = useState(null);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [fingerData, setFingerData] = useState(null);
    const [account, setAccount] = useState(''); 

  const registerFace = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/registerFace", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Parse the JSON response
      setFaceEncodings(data.face_encodings) // Update the resultStatus state

      console.log(data.face_encodings); // Log the message
    }
    catch (error) {
      console.error(error);
    }
  }

  const register = async () => {
    try {
      // Check if name, faceEncodings, and fingerData are available
      if (name && faceEncodings) {
        // Create an object with user data
        const userData = {
          name: name,
          faceEncodings: faceEncodings,
          fingerData: fingerData,
            walletAddress: account
        };

        // Make a POST request to the backend to store the user data
        const response = await fetch('http://127.0.0.1:5001/registerUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Convert to JSON string
        });

        if (response.ok) {
          // Data successfully stored in the database
          console.log('User data stored successfully.');
        } else {
          // Handle errors if the request fails
          console.error('Failed to store user data in the database.');
        }
      } else {
        // Handle cases where required data is missing
        console.error('Missing data (name, faceEncodings, or fingerData).');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const initWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);

        const accounts = await web3Instance.eth.getAccounts();
        console.log(accounts)
        setAccount(accounts[0]);

       
      } catch (error) {
        console.error("Failed to load web3, accounts, or contract.", error);
      }
    }
  };

  return (
    <>

      <div className="form-group">
        <label>Enter your name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <button onClick = {()=>initWeb3()}> Connect your wallet</button>
      <div>
      <label>
      Your wallet address:
      </label>
      <input disabled type="text" value={account} />
      </div>
      <div className="form-group">
        <button
          onClick={() => {
            registerFace();
          }}
          className="btn btn-primary"
        >
          Take my Picture
        </button>
      </div>
      <div className="form-group">
        <button
          onClick={() => {
            register();
          }}
          className="btn btn-primary"
        >
          Submit
        </button>
      </div>
    </>
  )
}
