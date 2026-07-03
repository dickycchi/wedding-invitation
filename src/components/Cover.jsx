import React, { useEffect, useState } from 'react';
import './Cover.css';
import bgImage from '../assets/cover_bg.png';

const Cover = ({ onOpen, isFadingOut }) => {
  const [guestName, setGuestName] = useState('Tamu Spesial');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('to');
    if (name) {
      setGuestName(name);
    }
  }, []);

  return (
    <div className={`cover-container ${isFadingOut ? 'fade-out' : 'fade-in'}`} style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="cover-overlay">
        <div className="cover-content">
          <p className="subtitle">THE WEDDING OF</p>
          <h1 className="title">Dicky & Diah</h1>
          <p className="date">02 Agustus 2026</p>

          <div className="guest-info">
            <p className="guest-label">Kepada Yth:</p>
            <h2 className="guest-name">{guestName}</h2>
          </div>

          <button className="open-btn" onClick={onOpen}>
            Buka Undangan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cover;
