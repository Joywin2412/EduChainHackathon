import { Button, Input } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
  const [name, setName] = useState(null);
  const [faceEncodings, setFaceEncodings] = useState(null);
  const [fingerData, setFingerData] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);

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

  const inputFinger = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/inputFinger", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const registerFinger = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5001/registerFinger", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Parse the JSON response
      setFingerData(data.fingerprint_encodings) // Update the resultStatus state
      console.log(data); // Log the message
    }
    catch (error) {
      console.error(error);
    }
  }


  const login = async () => {
    try {
      // Check if name, faceEncodings, and fingerData are available
      if (name && faceEncodings ) {
        // Create an object with user data
        const userData = {
          name: name,
          faceEncodings: faceEncodings,
          fingerData: fingerData,
        };

        // Make a POST request to the backend to store the user data
        const response = await fetch('http://127.0.0.1:5001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Convert to JSON string
        });


        // To access the response data, you need to parse the JSON from the response
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData.message)
          if (responseData.message === "Login Successful.") {
            // If face recognition is successful, set loggedIn to true
            navigate('/')
            localStorage.setItem('name', name);
            localStorage.setItem('wallet', responseData.wallet);
            console.log(name,responseData.wallet)
            setLoggedIn(true);
          } else {
            // If face recognition is unsuccessful, handle the error
            console.error('Failed to Log In');
          }
        } else {
          // Handle network or server errors when the response is not ok (e.g., HTTP status code other than 2xx)
          console.error('Failed to make the request. Status code:', response.status);
        }
      } else {
        // Handle cases where required data is missing
        console.error('Missing data (name, faceEncodings, or fingerData).');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const logout = () => {
    setName(null);
    setLoggedIn(false);
  };

  return (
    <>
        <div style = {{marginTop : "10px"}}>

          <div className="form-group">
            <label>Enter your name</label>
            <Input
              type="text"
              name="name"
              className="form-control"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <Button
              onClick={() => {
                registerFace();
              }}
              className="btn btn-primary"
            >
              Take my Picture
            </Button>
          </div>
         
          <div className="form-group">
            <Button
              onClick={() => {
                login();
              }}
              className="btn btn-primary"
            >
              LogIn
            </Button>
          </div>
        </div>
      
    </>
  );
}
