import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './interactor';
import TokenTransfer from './interactor2';
const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [fileTree, setFileTree] = useState([]);
    const [fileContent, setFileContent] = useState('');

const viewFileContent = async (filename) => {
    const { data } = await axios.get(`http://localhost:5000/file-content/${filename}`);
    setFileContent(data.content);
};


    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        await axios.post('http://localhost:5000/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

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
            <li key={item._id}>
                {item.name} - <a href={item.link} target="_blank" rel="noopener noreferrer">Download</a>
                <button onClick={() => viewFileContent(item.path.split('/').pop())}>View Content</button>

            </li>
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
        <div>
            <h2>File Upload</h2>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <h3>Files:</h3>
            <ul>
                {renderTree(fileTree)}
            </ul>
            {fileContent && (
                <div>
                    <h3>File Content:</h3>
                    <pre>{fileContent}</pre>
                </div>
            )}
            <button onClick={handleDeleteRepository}>Delete Repository</button>
            <TokenTransfer/>
        </div>
    );
};

export default FileUpload;
