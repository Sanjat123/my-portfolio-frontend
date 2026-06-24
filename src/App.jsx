import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Footer from './components/Footer'; // <-- Import kiya

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
      
      {/* Footer jo hamesha niche rahega */}
      <Footer />
    </div>
  );
}

export default App;