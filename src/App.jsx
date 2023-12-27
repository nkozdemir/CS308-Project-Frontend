import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserSongs from './pages/UserSongs';
import SearchSong from './pages/SearchSong';
import AddSong from './pages/AddSong';
import SongRatings from './pages/ratings/SongRatings';
import PerformerRatings from './pages/ratings/PerformerRatings';
import PrivateRoutes from './PrivateRoutes';
import ImportSong from './pages/ImportSong';
import AnalysisPage from './pages/Analysis';
import Navbar from './components/Navbar';
import Navbar2 from './components/Navbar2';
import Footer from './components/Footer';
import ExportPerfRatings from './pages/ratings/ExportPerfRatings';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          element={
            <>
              <Navbar />
              <PrivateRoutes />
              <Footer />
            </>
          }
        >
          <Route path="/" element={<Home />} /> 
          <Route path="/song/user" element={<UserSongs />} />
          <Route path="/song/search" element={<SearchSong />} />
          <Route path="/song/add" element={<AddSong />} />
          <Route path="/rating/song" element={<SongRatings />} />
          <Route path="/rating/performer" element={<PerformerRatings />} />
          <Route path="/rating/performer/export" element={<ExportPerfRatings />} />
          <Route path="/song/import" element={<ImportSong />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Route>
        <Route 
          path="/login" 
          element={
            <>
              <Navbar2 />
              <Login />
              <Footer />
            </>
          } 
        />
        <Route 
          path='/register' 
          element={
            <>
              <Navbar2 />
              <Register />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;