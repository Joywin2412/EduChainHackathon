const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const shortid = require('shortid');
const cors = require('cors');
const path = require('path');
const issueRouter = require("./routes/issueRouter");
const pullRequestRouter = require("./routes/pullRequestRouter");
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://joy:ryHVuNxW2ATaMtyy@cluster0.vffdptk.mongodb.net/FileUpload?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a Schema for storing files/folders
const fileSchema = new mongoose.Schema({
    name: String,
    type: String,
    path: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    link: String,
});

const File = mongoose.model('File', fileSchema);

// Set up Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/');
    },
    filename: (req, file, cb) => {
        cb(null, shortid.generate() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Route for uploading files/folders
app.post('/upload', upload.array('files'), async (req, res) => {
    const { parentId } = req.body;
    const files = req.files.map((file) => ({
        name: file.originalname,
        type: file.mimetype,
        path: file.path,
        parent: parentId || null,
        link: `files/${file.filename}`,
    }));

    const savedFiles = await File.insertMany(files);
    res.json(savedFiles);
});

// Route for getting the file/folder structure
app.get('/files', async (req, res) => {
    const files = await File.find().populate('parent').exec();
    res.json(files);
});

const fs = require('fs');

// Route to get the content of a specific file
app.get('/file-content/files/:filename', (req, res) => {
    try{
    const filepath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading file' });
        }
        res.json({ content: data });
    });
    }
    catch(err)
    {
        console.log(err);
        res.json(err);
    }
});
app.delete('/delete-repository', (req, res) => {
    // Logic to delete the repository
    // e.g., delete files from the server or database

    res.status(200).send({ message: 'Repository deleted successfully' });
});

// Serve files statically
app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.use("/issues", issueRouter);
app.use("/pull-requests", pullRequestRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
