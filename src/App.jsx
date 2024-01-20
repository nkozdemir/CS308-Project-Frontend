import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchSong from './pages/SearchSong';
import AddSong from './pages/AddSong';
import PrivateRoutes from './PrivateRoutes';
import ImportSong from './pages/ImportSong';
import AnalysisPage from './pages/Analysis';
import Navbar from './components/Navbar';
import Navbar2 from './components/Navbar2';
import Friends from './pages/Friends';
import RatingPage from './pages/RatingPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          element={
            <>
              <Navbar />
              <PrivateRoutes />
            </>
          }
        >
          <Route path="/" element={<Home />} /> 
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/song/search" element={<SearchSong />} />
          <Route path="/song/add" element={<AddSong />} />
          <Route path="/rating" element={<RatingPage />} />
          <Route path="/song/import" element={<ImportSong />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/friends" element={<Friends />} />
        </Route>
        <Route 
          path="/login" 
          element={
            <>
              <Navbar2 />
              <Login />
            </>
          } 
        />
        <Route 
          path='/register' 
          element={
            <>
              <Navbar2 />
              <Register />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;