import logo from './logo.svg';
import './App.css';
import FileUpload from './Comp';
import NavBar from './NavBar';
import { Route, Routes } from "react-router-dom";
import { Issues } from './Issues';
import { PullRequest } from './PullRequest';
import Signup from './Signup';
import Login from './Login';

function App() {
  return (
    <div style = {{}} className="App">
    <Routes>
        <Route path="/issues" element={<><NavBar/> <Issues/></>} />
        <Route path="/" element={<><NavBar/> <FileUpload/></>} />
        <Route path="/pull-requests" element={<><NavBar/> <PullRequest/></>} />
        <Route path="/signup" element={<><NavBar/> <Signup/></>} />
        <Route path="/login" element={<><NavBar/> <Login/></>} />

    </Routes>
  </div>
  );
}

export default App;
