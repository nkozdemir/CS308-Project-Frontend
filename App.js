import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login'; // Import the Login component
import Home from './Home'; // Import the Home component
import AddSong from './Addsong'; // Import the AddSong component
import Registration from './Registration';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page as the initial landing page */}
        <Route path="/home" element={<Home />} /> {/* Home page route */}
        <Route path="/add-song" element={<AddSong />} /> {/* Route for AddSong */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;