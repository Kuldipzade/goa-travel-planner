import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { StopsProvider } from './context/StopsContext';
import Roadmap from './pages/Roadmap';
import MapView from './components/MapView';
import StopModal from './components/StopModal';
import './App.css';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [activeTab, setActiveTab] = useState('roadmap');

  const openAdd = () => { setEditingStop(null); setModalOpen(true); };
  const openEdit = (stop) => { setEditingStop(stop); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingStop(null); };

  return (
    <StopsProvider>
      <div className="app">
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#1a1a2e', color: '#fff', border: '1px solid #f97316', fontSize: '0.875rem' },
            duration: 2500,
          }}
        />
        <header className="app-header">
          <div className="header-inner">
            <div className="logo">
              <span className="logo-icon">🌴</span>
              <div>
                <h1>Goa Wanderer</h1>
                <p>Your personal travel roadmap</p>
              </div>
            </div>
            <div className="header-right">
              <div className="tab-switcher">
                <button className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>🗺️ Roadmap</button>
                <button className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>📍 Map</button>
              </div>
              <button className="btn-add" onClick={openAdd}>+ Add Stop</button>
            </div>
          </div>
        </header>

        <main>
          {activeTab === 'roadmap' ? <Roadmap onEditStop={openEdit} /> : <MapView onEditStop={openEdit} />}
        </main>

        <nav className="bottom-nav">
          <button className={`bottom-nav-btn ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
            <span className="nav-icon">🗺️</span>
            Roadmap
          </button>
          <div className="bottom-nav-fab">
            <button className="fab-btn" onClick={openAdd} aria-label="Add stop">＋</button>
          </div>
          <button className={`bottom-nav-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
            <span className="nav-icon">📍</span>
            Map
          </button>
        </nav>

        {modalOpen && <StopModal stop={editingStop} onClose={closeModal} />}
      </div>
    </StopsProvider>
  );
}
