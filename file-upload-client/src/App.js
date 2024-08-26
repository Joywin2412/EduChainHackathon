import logo from './logo.svg';
import './App.css';
import FileUpload from './Comp';
import NavBar from './NavBar';
import { Route, Routes } from "react-router-dom";
import { Issues } from './Issues';
import { PullRequest } from './PullRequest';

function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/issues" element={<><NavBar/> <Issues/></>} />
        <Route path="/" element={<><NavBar/> <FileUpload/></>} />
      <Route path="/pull-requests" element={<><NavBar/> <PullRequest/></>} />
    </Routes>
  </div>
  );
}

export default App;
