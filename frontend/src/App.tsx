import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import PhotoGrid from './components/PhotoGrid';
import PhotoUpload from './components/PhotoUpload';
import PhotoDetail from './components/PhotoDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Photo Gallery</h1>
          <Routes>
            <Route path="/" element={<PhotoGrid />} />
            <Route path="/upload" element={<PhotoUpload />} />
            <Route path="/photos/:id" element={<PhotoDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
