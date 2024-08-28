import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TokenTransfer from './interactor2';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import WalletIcon from '@mui/icons-material/Wallet';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [fileTree, setFileTree] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [loading,setLoading] = useState(false);

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });   

const viewFileContent = async (filename) => {
    const { data } = await axios.get(`http://localhost:5000/file-content/${filename}`);
    setFileContent(data.content);
};


    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUpload = async () => {
        setLoading(true)
        try{
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        await axios.post('http://localhost:5000/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
    catch(err)
    {

    }
    setLoading(false)
        fetchFiles();
    };

    const fetchFiles = async () => {
        const { data } = await axios.get('http://localhost:5000/files');
        setFileTree(data);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const renderTree = (items, parentId = null) =>{

        
        return items.map(item => (
            <div 
            key={item._id} 
            style={{
              color: "#7349f2",
              fontWeight: "500",
            //   marginLeft: "20px",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#ecf5fe", // Optional: Add a background color
              border: "1px solid black ", // Lined border with a specific color
              borderRadius: "5px", // Rounded corners
              
            }}
          >
            <div style={{ width: "600px", display: "flex" , marginLeft : "10px" }}>
              {item.name}
            </div> 
            <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
              <Button href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px" }}>
                DOWNLOAD
              </Button>
              <Button color="secondary" onClick={() => viewFileContent(item.path.split('/').pop())}>
                View Content
              </Button>
            </div>
          </div>
          
        ));
    }
    const handleDeleteRepository = async () => {
        try {
            await axios.delete('http://localhost:5000/delete-repository');  // Replace with your actual API endpoint
            fetchFiles();  // Refresh the file list after deletion
        } catch (error) {
            console.error("There was an error deleting the repository!", error);
        }
    };
    return (
        <div style = {{marginLeft : "28px", marginTop : "28px" ,}}>
            <div style = {{display : "grid" , justifyContent : "left" , alignContent : "center" , rowGap : "10px",gridAutoFlow : "column"}}>
            <div>
            {loading === true ? 
                <LoadingButton loading variant="outlined">
  Submit
</LoadingButton>
:
        
        <div style = {{width : "871px" , display : "flex",justifyContent : "end" , columnGap : "10px"}}>
            <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            style = {{backgroundColor : "#EFECFE",color : "#5322E5"}}
            >
            
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
                multiple
            />
            </Button>
            <Button variant="contained" endIcon={<SendIcon />} onClick={handleUpload}             style = {{backgroundColor : "#7349f2"}}
            >
                Submit
            </Button>
        </div>
            }
            

            <Card style = {{backgroundColor : "#EFECFE", marginTop : "10px" , display : "grid" , rowGap : "0px" , padding : "10px",width : "850px"}}>
                {renderTree(fileTree)} 
            </Card>
            </div>
            {fileContent && (
                <div>
                    <h3>File Content:</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}
            {/* <button onClick={handleDeleteRepository}>Delete Repository</button> */}
            <TokenTransfer/>
        </div>
        </div>
    );

};

export default FileUpload;
