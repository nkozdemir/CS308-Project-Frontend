import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './login/Login'; // Import the Login component
import Home from './homepage/Home'; // Import the Home component
import AddSong from './addsong/Addsong'; // Import the AddSong component
import Registration from './register/Registration';
import Seeaddedsongs from './SeeAddedSongs/UserSongs.js'
import Dashboard from './Dashboard/Dashboard.js';
import SearchSong from './SearchSong/SearchSong.js';
import Csvadd from './csvadd/csvadd'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page as the initial landing page */}
        <Route path="/home" element={<Home />} /> {/* Home page route */}
        <Route path="/add-song" element={<AddSong />} /> {/* Route for AddSong */}
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-songs" element={<Seeaddedsongs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/SearchSong" element={<SearchSong />} />
        <Route path="/csvadd" element={<Csvadd/>} />
      </Routes>
    </Router>
  );
};

export default App;